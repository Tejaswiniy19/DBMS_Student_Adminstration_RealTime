import { useEffect, useState } from "react";
import api from "../../api/api";

export default function Notifications() {

  const [notifications,setNotifications] =
    useState([]);

  useEffect(() => {

    loadNotifications();

  }, []);

  const loadNotifications = async () => {

    try{

      const res =
      await api.get("/notifications");

      setNotifications(
       res.data.notifications
      );

    }catch(error){
      console.error(error);
    }

  };

  const markRead = async(id)=>{

    try{

      await api.put(
       `/notifications/${id}/read`
      );

      loadNotifications();

    }catch(error){
      console.error(error);
    }

  };

  return (

    <div className="space-y-4">

      <h1 className="text-2xl font-bold">
        Notifications
      </h1>

      {notifications.length === 0 && (

        <div className="card-glass p-4 rounded-xl">

          No Notifications

        </div>

      )}

      {notifications.map((n)=>(

        <div
         key={n.id}
         className="card-glass p-4 rounded-xl"
        >

          <h3 className="font-semibold">
            {n.title}
          </h3>

          <p className="text-slate-500">
            {n.message}
          </p>

          {!n.read && (

            <button
             onClick={() =>
              markRead(n.id)
             }
             className="mt-3 bg-blue-600
             text-white px-3 py-2 rounded-lg"
            >

             Mark Read

            </button>

          )}

        </div>

      ))}

    </div>

  );
}