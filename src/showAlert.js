export default {
  data() {
    return {
      alert: {
        visible: false,
        color: '',
        message: '',
        timeout: 0,
        dismissible: false,
      },
    };
  },
  methods: {
    showAlert(color, message, timeout = 6000, dismissible = false) {
      this.alert = {
        visible: true,
        color: color,
        message: message,
        dismissible: dismissible,
      };
      if (!dismissible) {
        setTimeout(() => {
            this.alert.visible = false;
            this.hideAlert()
        }, timeout); // Ajuste o tempo conforme necessário
      }
    },
    hideAlert() {
      this.alert.visible = false;
    },
  },
};