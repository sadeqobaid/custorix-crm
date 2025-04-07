from rest_framework import serializers
from .models import User, Role, Permission, Department, Team, UserPermission, RolePermission, TeamMember

class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = '__all__'

class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = '__all__'

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email', 'username', 'role', 'department', 
                 'phone', 'job_title', 'profile_image_url', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

class UserDetailSerializer(serializers.ModelSerializer):
    role = RoleSerializer(read_only=True)
    department = DepartmentSerializer(read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email', 'username', 'role', 'department', 
                 'phone', 'job_title', 'profile_image_url', 'is_active', 'is_email_verified',
                 'last_login_at', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at', 'last_login_at']

class TeamSerializer(serializers.ModelSerializer):
    team_leader = UserSerializer(read_only=True)
    
    class Meta:
        model = Team
        fields = '__all__'

class TeamMemberSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    team = TeamSerializer(read_only=True)
    
    class Meta:
        model = TeamMember
        fields = '__all__'

class UserPermissionSerializer(serializers.ModelSerializer):
    permission = PermissionSerializer(read_only=True)
    
    class Meta:
        model = UserPermission
        fields = '__all__'

class RolePermissionSerializer(serializers.ModelSerializer):
    permission = PermissionSerializer(read_only=True)
    role = RoleSerializer(read_only=True)
    
    class Meta:
        model = RolePermission
        fields = '__all__'
