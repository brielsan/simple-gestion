import Swal from "sweetalert2";

export const Confirm = async (title, text, icon) => {
  try {
    const alertResponse = await Swal.fire({
      title: title,
      text: text,
      icon: icon,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    return alertResponse?.isConfirmed || false;
  } catch (error) {
    console.error("Error in Confirm:", error);
    return false;
  }
};

export const Alert = async (title, text, icon, timer) => {
  try {
    await Swal.fire({
      title: title,
      text: text,
      icon: icon,
      timer: timer,
    });
  } catch (error) {
    console.error("Error in Alert:", error);
  }
};
