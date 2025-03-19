from rest_framework import serializers

from users.serializers import CustomUserSerializer

from .models import Task, TaskAttachment, TaskComment


class TaskAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskAttachment
        fields = ['id', 'file', 'uploaded_by', 'uploaded_at', 'description']
        read_only_fields = ['uploaded_by', 'uploaded_at']

class TaskCommentSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer(read_only=True)

    class Meta:
        model = TaskComment
        fields = ['id', 'task', 'user', 'content', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

class TaskSerializer(serializers.ModelSerializer):
    created_by = CustomUserSerializer(read_only=True)
    assigned_to = CustomUserSerializer(read_only=True)
    comments = TaskCommentSerializer(many=True, read_only=True)
    attachments = TaskAttachmentSerializer(many=True, read_only=True)
    subtasks = serializers.SerializerMethodField()

    class Meta:
        model = Task
        fields = [
            'id', 'title', 'description', 'created_by', 'assigned_to',
            'priority', 'status', 'due_date', 'created_at', 'updated_at',
            'completed_at', 'parent_task', 'comments', 'attachments', 'subtasks'
        ]
        read_only_fields = ['created_at', 'updated_at', 'completed_at']

    def get_subtasks(self, obj):
        subtasks = obj.subtasks.all()
        return TaskSerializer(subtasks, many=True).data

    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data) 