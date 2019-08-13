var NuggetNova = {
    ToastrTypeEnum: {
        Success: 'success',
        Info: 'info',
        Warning: 'warning',
        Error: 'error'
    },
    showToastrMessage: function (type, message) {
        alert('hello');
        toastr['success']('hello');
        return '';
    }
};