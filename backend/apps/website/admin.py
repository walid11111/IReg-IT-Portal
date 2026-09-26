from django.contrib import admin
from django.utils.html import format_html
from .models import TeamMember, MemberSocial, Service, ServiceFeature, Technology, Job

class MemberSocialInline(admin.TabularInline):
    model = MemberSocial
    extra = 1

class TeamMemberAdmin(admin.ModelAdmin):
    list_display = ("name", "role", "category", "leadership", "order", "is_active")
    list_editable = ("category", "leadership", "order", "is_active")
    list_filter = ("category", "leadership", "is_active")
    readonly_fields = ("photo_preview",)
    inlines = [MemberSocialInline]

    def photo_preview(self, obj):
        if obj.photo:
            return format_html('<img src="{}" width="80" height="80" style="border-radius:50%;object-fit:cover;" />', obj.photo.url)
        return "No photo uploaded"

    photo_preview.short_description = "Current photo"

class TechnologyAdmin(admin.ModelAdmin):
    list_display = ("name", "order", "is_active")
    list_editable = ("order", "is_active")

class JobAdmin(admin.ModelAdmin):
    list_display = ("title", "is_featured", "order", "is_active")
    list_editable = ("is_featured", "order", "is_active")
    list_filter = ("is_featured", "is_active")

class ServiceFeatureInline(admin.TabularInline):
    model = ServiceFeature
    extra = 1

class ServiceAdmin(admin.ModelAdmin):
    list_display = ("title", "category", "is_featured", "order", "is_active")
    list_editable = ("category", "is_featured", "order", "is_active")
    list_filter = ("category", "is_featured", "is_active")
    inlines = [ServiceFeatureInline]

admin.site.register(TeamMember, TeamMemberAdmin)
admin.site.register(Service, ServiceAdmin)
admin.site.register(Technology, TechnologyAdmin)
admin.site.register(Job, JobAdmin)