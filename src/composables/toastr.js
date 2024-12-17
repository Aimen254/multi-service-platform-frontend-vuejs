import Swal from 'sweetalert2';

// set background color
const background = type => {
    let bgColor = '';
    switch (type) {
        case 'success':
            bgColor = 'rgba(113, 221, 55, 0.85)';
            break;
        case 'error':
            bgColor = 'red';
            break;
        case 'warning':
            bgColor = '#ffc107';
            break;
        case 'info':
            bgColor = '#17a2b8';
            break;
    }
    return bgColor;
}

// taostr alert
export const useToastr = () => {
    const toast = (text, type = 'success') => {
        Swal.fire({
            position: 'bottom-end',
            text: text,
            icon: type,
            iconColor: 'white',
            showConfirmButton: false,
            background: background(type),
            timer: 2000,
            toast: true,
            showCloseButton: true,
            customClass: {
                popup: 'green-toaster',
                closeButton: 'custom-close-button'
            },
        })
    }

    // confirm popup alert
    const confirm = (text, confirm, icon = 'question', title = 'Are you sure?', showConfirm = true) => {
        return new Promise((resolve) => {
            Swal.fire({
                title: title,
                html: text,
                icon: icon,
                confirmButtonColor: '#ff6846',
                showCancelButton: true,
                confirmButtonText: confirm,
                showConfirmButton: showConfirm,
                customClass: {
                    confirmButton: 'custom-confirm-button'
                },
            }).then((result) => {
                resolve(result);
            });
        });
    }
    return {
        toast,
        confirm
    };
}