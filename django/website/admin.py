from django.contrib import admin
from .models import (
    TeamMember, Address, Service, Project, 
    Testimonial, Partner, FAQ, PricingPlan, 
    ContactMessage, CompanyInfo, Post
)


@admin.register(TeamMember)
class TeamMemberAdmin(admin.ModelAdmin):
    list_display = ['name', 'position', 'email', 'order', 'is_active']
    list_filter = ['is_active']
    search_fields = ['name', 'position', 'bio']
    list_editable = ['order', 'is_active']


@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = ['name', 'city', 'country', 'phone', 'is_main', 'is_active']
    list_filter = ['is_main', 'is_active', 'country']
    search_fields = ['name', 'street_address', 'city']


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'icon', 'order', 'is_active']
    list_filter = ['category', 'is_active']
    search_fields = ['title', 'description']
    list_editable = ['order', 'is_active']
    prepopulated_fields = {'slug': ('title',)}


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['title', 'client', 'status', 'completion_date', 'is_featured', 'order', 'is_active']
    list_filter = ['status', 'is_featured', 'is_active']
    search_fields = ['title', 'client', 'description']
    list_editable = ['order', 'is_featured', 'is_active']
    prepopulated_fields = {'slug': ('title',)}


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ['client_name', 'client_company', 'rating', 'is_featured', 'order']
    list_filter = ['rating', 'is_featured', 'is_active']
    search_fields = ['client_name', 'client_company', 'content']
    list_editable = ['order', 'is_featured']


@admin.register(Partner)
class PartnerAdmin(admin.ModelAdmin):
    list_display = ['name', 'partnership_type', 'order', 'is_active']
    list_filter = ['is_active']
    search_fields = ['name', 'description']
    list_editable = ['order', 'is_active']
    prepopulated_fields = {'slug': ('name',)}


@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    list_display = ['question', 'category', 'order', 'is_active']
    list_filter = ['category', 'is_active']
    search_fields = ['question', 'answer']
    list_editable = ['order', 'is_active']


@admin.register(PricingPlan)
class PricingPlanAdmin(admin.ModelAdmin):
    list_display = ['name', 'plan_type', 'price', 'currency', 'is_popular', 'order']
    list_filter = ['plan_type', 'is_popular', 'is_active']
    search_fields = ['name', 'description']
    list_editable = ['order', 'is_popular']


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'subject', 'is_read', 'is_replied', 'created_at']
    list_filter = ['subject', 'is_read', 'is_replied']
    search_fields = ['name', 'email', 'message']
    list_editable = ['is_read', 'is_replied']
    readonly_fields = ['created_at']


@admin.register(CompanyInfo)
class CompanyInfoAdmin(admin.ModelAdmin):
    list_display = ['key', 'value', 'updated_at']
    search_fields = ['key', 'value']


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'author', 'date', 'featured', 'is_active', 'updated_at']
    list_filter = ['category', 'featured', 'is_active']
    search_fields = ['title', 'excerpt', 'content', 'author', 'tags']
    list_editable = ['featured', 'is_active']
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields = ['created_at', 'updated_at']
    date_hierarchy = 'date'


# Customize admin site header and title
admin.site.site_header = 'Enzi Dev Admin'
admin.site.site_title = 'Enzi Dev Admin Portal'
admin.site.index_title = 'Website Management'
