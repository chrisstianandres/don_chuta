from django.urls import reverse_lazy


class lodeguser():
    """Verify that the current user is authenticated."""
    def dispatch(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            reverse_lazy('menu')
        return super().dispatch(request, *args, **kwargs)
