import toast from "react-hot-toast";

const toastService = {

    success(message) {

        toast.success(message);

    },

    error(message) {

        toast.error(message);

    },

    loading(message = "Caricamento...") {

        return toast.loading(message);

    },

    dismiss(id) {

            if (id) {

        toast.dismiss(id);

        return;

    }

    toast.dismiss();

    }

};

export default toastService;