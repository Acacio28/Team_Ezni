"""Seed Post rows from website/js/posts-data.js (idempotent by title)."""
import json
import re
import subprocess
from pathlib import Path
from datetime import date
from django.core.management.base import BaseCommand
from website.models import Post

WEBSITE_JS = Path(__file__).resolve().parent.parent.parent.parent.parent / 'website' / 'js' / 'posts-data.js'


class Command(BaseCommand):
    help = 'Import posts from website/js/posts-data.js into the Post table'

    def handle(self, *args, **options):
        if not WEBSITE_JS.exists():
            self.stderr.write(f'Not found: {WEBSITE_JS}')
            return

        posts = self._load_posts(WEBSITE_JS)
        if posts is None:
            return

        created = 0
        updated = 0
        for item in posts:
            title = (item.get('title') or '').strip()
            if not title:
                continue
            defaults = {
                'slug': '',
                'excerpt': item.get('excerpt') or '',
                'content': item.get('content') or '',
                'category': item.get('category') or 'Company',
                'tags': item.get('tags') or [],
                'image': item.get('image') or '',
                'author': item.get('author') or '',
                'author_role': item.get('authorRole') or '',
                'date': item.get('date') or date.today().isoformat(),
                'read_time': int(item.get('readTime') or 3),
                'featured': bool(item.get('featured')),
                'is_active': True,
            }
            obj, was_created = Post.objects.update_or_create(
                title=title,
                defaults=defaults,
            )
            if was_created:
                created += 1
            else:
                updated += 1

        self.stdout.write(self.style.SUCCESS(
            f'Done: {created} created, {updated} updated (total {Post.objects.count()})'
        ))

    def _load_posts(self, path: Path):
        # Prefer Node for reliable JS parsing
        script = f'''
const fs = require("fs");
const src = fs.readFileSync({json.dumps(str(path))}, "utf8");
const sandbox = {{}};
// Evaluate POSTS assignment in a function scope
const fn = new Function(src + "; return POSTS;");
const posts = fn();
process.stdout.write(JSON.stringify(posts));
'''
        try:
            out = subprocess.check_output(['node', '-e', script], text=True, timeout=15)
            return json.loads(out)
        except (subprocess.CalledProcessError, FileNotFoundError, json.JSONDecodeError) as e:
            self.stderr.write(f'Node parse failed ({e}); falling back to regex')

        # Fallback: manual field extraction per object
        text = path.read_text(encoding='utf-8')
        m = re.search(r'var\s+POSTS\s*=\s*\[(.*)\];\s*var\s+POST_CATEGORIES', text, re.S)
        if not m:
            self.stderr.write('Could not find POSTS array')
            return None
        body = m.group(1)
        objs = re.findall(r'\{(.*?)\}(?=\s*,\s*\{|\s*$)', body, re.S)
        posts = []
        for chunk in objs:
            item = {}
            for key in ['id', 'title', 'excerpt', 'content', 'category', 'image', 'author', 'authorRole', 'date']:
                km = re.search(rf"{key}:\s*'((?:\\\\'|[^'])*)'", chunk)
                if km:
                    item[key] = km.group(1).replace("\\'", "'")
            fm = re.search(r'featured:\s*(true|false)', chunk)
            if fm:
                item['featured'] = fm.group(1) == 'true'
            rm = re.search(r'readTime:\s*(\d+)', chunk)
            if rm:
                item['readTime'] = int(rm.group(1))
            tm = re.search(r"tags:\s*\[(.*?)\]", chunk, re.S)
            if tm:
                item['tags'] = re.findall(r"'((?:\\\\'|[^'])*)'", tm.group(1))
            if item.get('title'):
                posts.append(item)
        return posts
