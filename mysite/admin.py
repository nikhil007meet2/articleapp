from django.contrib import admin
from django.contrib.sessions.models import Session
# Register your models here.
from .models import Article, State, Subject, District, School, Teacher


# class articleAdmin(admin.ModelAdmin):
#     list_display = (
#         'title',
#         'name',
#         'votes',
#         'last_voted_on',
#     )

#     search_fields = (
#         'title',
#         'name',
#     )


# admin.site.register(Article, articleAdmin)


class SessionAdmin(admin.ModelAdmin):
    def _session_data(self, obj):
        return obj.get_decoded()
    list_display = ['session_key', '_session_data', 'expire_date']
admin.site.register(Session, SessionAdmin)

class stateAdmin(admin.ModelAdmin):
    list_display = (
        'state_code',
        'state_name',
        )


admin.site.register(State, stateAdmin)


class stateAdmin(admin.ModelAdmin):
    list_display = (
        'subject_name',
        'grade',
        )


admin.site.register(Subject, stateAdmin)

class districtAdmin(admin.ModelAdmin):
    list_display = (
        'district_name',
        'state',
        'district_head_name',
        'district_contact_name',
        'district_email_name',
        'mswo_head_name',
        'mswo_contact_name',
        'mswo_email_name',
        )

    search_fields = (
        'district_name',
        'district_head_name',
    )


admin.site.register(District, districtAdmin)


class schoolAdmin(admin.ModelAdmin):
    list_display = (
        'name',
        'district',
        'principle'
        )
	


admin.site.register(School, schoolAdmin)


class teacherAdmin(admin.ModelAdmin):
    list_display = (
        'teacher_name',
        'gender',
        'dob',
        'qualification',
        'school',
        )


admin.site.register(Teacher, teacherAdmin)