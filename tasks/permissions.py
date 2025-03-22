from rest_framework import permissions


class IsTaskAssigneeOrAdmin(permissions.BasePermission):
    """
    Custom permission to only allow task assignees, creators, or admins to edit tasks.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # Allow admins to perform any action
        if request.user.role == 'admin':
            return True
        
        # Allow task creators and assignees to view and edit their tasks
        return obj.created_by == request.user or obj.assigned_to == request.user

class IsTaskCreatorOrAdmin(permissions.BasePermission):
    """
    Custom permission to only allow task creators or admins to delete tasks.
    """
    def has_object_permission(self, request, view, obj):
        # Allow admins to perform any action
        if request.user.role == 'admin':
            return True
        
        # Allow task creators to delete their tasks
        return obj.created_by == request.user 