var NuggetNova = {
    ToastrTypeEnum: {
        Success: 'success',
        Info: 'info',
        Warning: 'warning',
        Error: 'error'
    },
    showToastrMessage: function (type, message) {
        return toastr[type](message);
    }
};