from django.db import models
from core.models import BaseModel

class Role(BaseModel):
    role_name = models.CharField(max_length=50, unique=True)
    description = models.TextField(null=True, blank=True)
    is_system_role = models.BooleanField(default=False)

    def __str__(self):
        return self.role_name

class Permission(BaseModel):
    permission_name = models.CharField(max_length=100, unique=True)
    description = models.TextField(null=True, blank=True)
    resource_type = models.CharField(max_length=50)
    action_type = models.CharField(max_length=50)

    def __str__(self):
        return self.permission_name

class Department(BaseModel):
    department_name = models.CharField(max_length=100, unique=True)
    parent_department = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='child_departments')
    manager = models.ForeignKey('User', on_delete=models.SET_NULL, null=True, blank=True, related_name='managed_departments')
    description = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.department_name

class User(BaseModel):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=100, unique=True)
    password_hash = models.CharField(max_length=255)
    role = models.ForeignKey(Role, on_delete=models.SET_NULL, null=True, related_name='users')
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, related_name='users')
    phone = models.CharField(max_length=20, null=True, blank=True)
    job_title = models.CharField(max_length=100, null=True, blank=True)
    profile_image_url = models.CharField(max_length=255, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_email_verified = models.BooleanField(default=False)
    last_login_at = models.DateTimeField(null=True, blank=True)
    permissions = models.ManyToManyField(Permission, through='UserPermission')

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

class UserPermission(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    permission = models.ForeignKey(Permission, on_delete=models.CASCADE)
    is_granted = models.BooleanField(default=True)

    class Meta:
        unique_together = ('user', 'permission')

class RolePermission(BaseModel):
    role = models.ForeignKey(Role, on_delete=models.CASCADE)
    permission = models.ForeignKey(Permission, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('role', 'permission')

class Team(BaseModel):
    team_name = models.CharField(max_length=100)
    description = models.TextField(null=True, blank=True)
    team_leader = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='led_teams')
    members = models.ManyToManyField(User, through='TeamMember', related_name='teams')

    def __str__(self):
        return self.team_name

class TeamMember(BaseModel):
    team = models.ForeignKey(Team, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=50, null=True, blank=True)
    
    class Meta:
        unique_together = ('team', 'user')
