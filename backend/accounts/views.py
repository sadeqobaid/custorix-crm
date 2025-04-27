from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import User, Role, Permission, Department, Team, UserPermission, RolePermission, TeamMember
from .serializers import (
    UserSerializer, UserDetailSerializer, RoleSerializer, PermissionSerializer,
    DepartmentSerializer, TeamSerializer, TeamMemberSerializer,
    UserPermissionSerializer, RolePermissionSerializer
)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    
    def get_permissions(self):
        # Allow unauthenticated access for create (registration)
        if self.action == 'create':
            return []
        # Require authentication for all other actions
        return [permissions.IsAuthenticated()]
    
    def get_serializer_class(self):
        if self.action == 'retrieve' or self.action == 'update':
            return UserDetailSerializer
        return UserSerializer
    
    def create(self, request, *args, **kwargs):
        # Extract data from request
        data = request.data
        
        # Map frontend field names to backend field names
        mapped_data = {
            'first_name': data.get('fullName', '').split(' ')[0] if data.get('fullName') else '',
            'last_name': ' '.join(data.get('fullName', '').split(' ')[1:]) if data.get('fullName') and len(data.get('fullName', '').split(' ')) > 1 else '',
            'email': data.get('email', ''),
            'username': data.get('username', ''),
            'password': data.get('password', ''),
            'phone': data.get('phone', ''),
            'job_title': data.get('jobTitle', ''),
        }
        
        # Create user with create_user method to properly hash password
        try:
            user = User.objects.create_user(
                username=mapped_data['username'],
                email=mapped_data['email'],
                password=mapped_data['password'],
                first_name=mapped_data['first_name'],
                last_name=mapped_data['last_name'],
                phone=mapped_data['phone'],
                job_title=mapped_data['job_title']
            )
            
            # Return serialized user data
            serializer = self.get_serializer(user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class RoleViewSet(viewsets.ModelViewSet):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    permission_classes = [permissions.IsAuthenticated]

class PermissionViewSet(viewsets.ModelViewSet):
    queryset = Permission.objects.all()
    serializer_class = PermissionSerializer
    permission_classes = [permissions.IsAuthenticated]

class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [permissions.IsAuthenticated]

class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    permission_classes = [permissions.IsAuthenticated]

class TeamMemberViewSet(viewsets.ModelViewSet):
    queryset = TeamMember.objects.all()
    serializer_class = TeamMemberSerializer
    permission_classes = [permissions.IsAuthenticated]

class UserPermissionViewSet(viewsets.ModelViewSet):
    queryset = UserPermission.objects.all()
    serializer_class = UserPermissionSerializer
    permission_classes = [permissions.IsAuthenticated]

class RolePermissionViewSet(viewsets.ModelViewSet):
    queryset = RolePermission.objects.all()
    serializer_class = RolePermissionSerializer
    permission_classes = [permissions.IsAuthenticated]
