from django.contrib import admin
from .models import Role, Permission, Department, User, UserPermission, RolePermission, Team, TeamMember

# Register your models
admin.site.register(Role)
admin.site.register(Permission)
admin.site.register(Department)
admin.site.register(User)
admin.site.register(UserPermission)
admin.site.register(RolePermission)
admin.site.register(Team)
admin.site.register(TeamMember)
