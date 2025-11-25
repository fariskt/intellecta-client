import { LucidePlusCircle } from "lucide-react";
import { useState } from "react";
import SearchUser from "../../utils/ui/searchBarUser";
import { useMutation } from "@tanstack/react-query";
import { sendNotification } from "./services/services";
import Swal from "sweetalert2";

interface Props {
  onClose: () => void;
}

type Mode = "none" | "all" | "individual" | "5-8" | "9-12" | "13-18";

const NotificationPanel = ({ onClose }: Props) => {
  const [createButton, setCreateButton] = useState(false);
  const [mode, setMode] = useState<Mode>("none");
  const [selectedUser, setSelectedUser] = useState<{
    name: string;
    email: string;
  } | null>(null);

  const [notificationData, setNotificationData] = useState({
    title: "",
    message: "",
    type: "",
    targetType: "",
    targetAgeGroup: "",
    recipientId: "",
  });

  const handleFieldChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNotificationData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
    setSelectedUser(null);

    setNotificationData((prev) => ({
      ...prev,
      targetType:
        newMode === "all"
          ? "all"
          : newMode === "individual"
          ? "individual"
          : ["5-8", "9-12", "13-18"].includes(newMode)
          ? "age-group"
          : "",
      targetAgeGroup: ["5-8", "9-12", "13-18"].includes(newMode) ? newMode : "",
      recipientId: newMode === "individual" ? prev.recipientId : "",
    }));
  };

  const renderInputFields = () => (
    <div className="flex flex-col items-center justify-center mt-8 gap-y-6 w-full">
      <input
        type="text"
        name="title"
        placeholder="Enter Title"
        value={notificationData.title}
        onChange={handleFieldChange}
        className="border border-gray-400 p-2 rounded-lg w-4/5 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
      />

      <textarea
        name="message"
        value={notificationData.message}
        onChange={handleFieldChange}
        className="bg-gray-50 p-2 h-48 rounded-lg w-4/5 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
        placeholder="Enter the message..."
      />

      <input
        type="text"
        name="type"
        placeholder="Enter Type (e.g. announcement)"
        value={notificationData.type}
        onChange={handleFieldChange}
        className="border border-gray-400 p-2 rounded-lg w-4/5 bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
      />

      <button
        className="bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-3 rounded-xl text-white font-medium hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg"
        onClick={handleSendNotification}
      >
        Send Notification
      </button>
    </div>
  );

  const handleSendNotification = () => {
    const { title, message, type, recipientId, targetAgeGroup } =
      notificationData;

    if (!title || !message || !type) {
      alert("Please fill in all the fields.");
      return;
    }

    if (mode === "individual" && !recipientId) {
      alert("Please select a user.");
      return;
    }

    if (["5-8", "9-12", "13-18"].includes(mode) && !targetAgeGroup) {
      alert("Please select a valid age group.");
      return;
    }

    console.log("Sending Notification:", notificationData);
    mutation.mutate(notificationData);
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Your work has been saved",
      showConfirmButton: false,
      timer: 1500,
    });
  };

  const mutation = useMutation({
    mutationFn: sendNotification,
    onSuccess: (data) => {
      console.log("Notification sent successfully!", data);
      alert("Notification sent!");
      setCreateButton(false);
      setNotificationData({
        title: "",
        message: "",
        type: "",
        targetType: "",
        targetAgeGroup: "",
        recipientId: "",
      });
      setMode("none");
      setSelectedUser(null);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      console.error("Failed to send notification", error);
      alert("Failed to send notification.");
    },
  });

  return (
<div className="fixed top-[350px] scrollbar-hide min-h-[500px] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full md:w-2/5 bg-gradient-to-b from-gray-50 to-white shadow-2xl z-50 transition-all duration-500 overflow-auto scrollbar-thin scrollbar-thumb-indigo-300 scrollbar-track-gray-100 max-h-[90vh] rounded-2xl">
<div className="flex justify-between items-center p-6 border-b border-gray-200 ">
        <h2 className="text-2xl font-bold text-gray-800">Send Notifications</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-800 text-xl transition-colors"
        >
          ✕
        </button>
      </div>

      <div className="p-6">
        <div className="flex justify-center">
          <button
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all shadow-md"
            onClick={() => {
              setCreateButton(!createButton);
              setMode("none");
              setNotificationData({
                title: "",
                message: "",
                type: "",
                targetType: "",
                targetAgeGroup: "",
                recipientId: "",
              });
              setSelectedUser(null);
            }}
          >
            {createButton ? (
              "Cancel"
            ) : (
              <>
                <LucidePlusCircle size={20} /> Create
              </>
            )}
          </button>
        </div>

        {createButton && (
          <div className="mt-6 space-y-8">
            <div className="flex flex-col items-center gap-3">
              <div className="flex justify-center gap-4">
                {["all", "individual"].map((m) => (
                  <button
                    key={m}
                    className={`px-4 py-2 rounded-xl capitalize font-medium ${
                      mode === m
                        ? "bg-indigo-600 text-white shadow-md"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    } transition-all`}
                    onClick={() => handleModeChange(m as Mode)}
                  >
                    {m === "individual" ? "Personal" : "All Users"}
                  </button>
                ))}
              </div>

              <div className="flex justify-center gap-4">
                {["5-8", "9-12", "13-18"].map((m) => (
                  <button
                    key={m}
                    className={`px-4 py-2 rounded-xl capitalize font-medium ${
                      mode === m
                        ? "bg-indigo-600 text-white shadow-md"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    } transition-all`}
                    onClick={() => handleModeChange(m as Mode)}
                  >
                    Age {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Individual User Mode */}
            {mode === "individual" && (
              <div className="flex flex-col items-center gap-4 mt-6">
                <SearchUser
                  onSelect={(
                    studentId: string,
                    studentName?: string,
                    studentEmail?: string
                  ) => {
                    setNotificationData((prev) => ({
                      ...prev,
                      recipientId: studentId,
                    }));
                    setSelectedUser({
                      name: studentName || "Selected Student",
                      email: studentEmail || "",
                    });
                  }}
                />
                {selectedUser && (
                  <p className="text-sm text-gray-600 bg-gray-100 p-3 rounded-lg">
                    Sending to: <strong>{selectedUser.name}</strong> (
                    {selectedUser.email})
                  </p>
                )}
                {notificationData.recipientId && renderInputFields()}
              </div>
            )}

            {/* Group Modes */}
            {(mode === "all" || ["5-8", "9-12", "13-18"].includes(mode)) &&
              renderInputFields()}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;
