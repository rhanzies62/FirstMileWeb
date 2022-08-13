import BookingFormPage from "../screen/pages/BookingFormPage";
import BookingPage from "../screen/pages/BookingPage";
import CustomerFormPage from "../screen/pages/CustomerFormPage";
import CustomerMeiliPage from "../screen/pages/CustomerMeiliPage";
import CustomerPage from "../screen/pages/CustomerPage";
import DashboardPage from "../screen/pages/DashboardPage";
import EquipmentPage from "../screen/pages/EquipmentPage";
import LogoutPage from "../screen/pages/LogoutPage";
import UserBookingHistory from "../screen/pages/UserBookingHistory";
import { UserDashboardPage } from "../screen/pages/UserDashboardPage";
import UserPage from "../screen/pages/UserPage";

export default {
  equiment: {},
  auth: {
    isLoggedIn: false,
    userType: "",
    userInfo: {},
    menus: [],
    routes: [],
  },
  adminMenu: [
    {
      Icon: "k-i-inbox",
      Link: "/",
      Label: "Dashboard",
    },
    {
      Icon: "k-i-gear",
      Link: "/equipments",
      Label: "Equipment",
    },
    {
      Icon: "k-i-calendar",
      Link: "/bookings",
      Label: "Booking",
    },
    {
      Icon: "icon-user2",
      Link: "/customers",
      Label: "Customers",
    },
    {
      Icon: "icon-user2",
      Link: "/users",
      Label: "Users",
    },
    {
      Icon:"icon-history",
      Link: "/meili",
      Label: "Meili"
    }
  ],
  adminRoutes: [
    {
      Exact: true,
      Path: "/",
      Component: DashboardPage,
    },
    {
      Exact: false,
      Path: "/equipments",
      Component: EquipmentPage,
    },

    {
      Exact: false,
      Path: "/bookings",
      Component: BookingPage,
    },

    {
      Exact: false,
      Path: "/customers",
      Component: CustomerPage,
    },

    {
      Exact: false,
      Path: "/editcustomer",
      Component: CustomerFormPage,
    },

    {
      Exact: false,
      Path: "/editbooking",
      Component: BookingFormPage,
    },

    {
      Exact: false,
      Path: "/users",
      Component: UserPage,
    },
    {
      Exact: false,
      Path: "/meili",
      Component: CustomerMeiliPage
    },
    {
      Exact: false,
      Path: "/logout",
      Component: LogoutPage,
    },
  ],
  userMenu: [
    {
      Icon: "k-i-inbox",
      Link: "/",
      Label: "Dashboard",
    },
    {
      Icon: "icon-history",
      Link: "/bookings",
      Label: "Booking History",
    },
    {
      Icon:"icon-history",
      Link: "/meili",
      Label: "Meili"
    }
  ],
  userRoutes: [
    {
      Exact: true,
      Path: "/",
      Component: UserDashboardPage,
    },
    {
      Exact: false,
      Path: "/bookings",
      Component: UserBookingHistory,
    },
    {
      Exact: false,
      Path: "/meili",
      Component: CustomerMeiliPage
    },
    {
      Exact: false,
      Path: "/logout",
      Component: LogoutPage,
    },
  ],
};
