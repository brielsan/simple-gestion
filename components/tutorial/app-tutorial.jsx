"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

export default function AppTutorial() {
  const driverRef = useRef(null);
  const searchParams = useSearchParams();

  const isMobile = () => {
    if (!window) return false;
    return window.innerWidth < 768;
  };

  useEffect(() => {
    const getTutorialSteps = () => {
      const baseSteps = [
        {
          element: "[data-tutorial='welcome']",
          popover: {
            title: "Welcome to Simple Gestión!",
            description:
              "This is your personal finance dashboard. Let's take a quick tour to help you get started with managing your finances.",
            side: "bottom",
            align: "start",
          },
        },
        {
          element: "[data-tutorial='balance-card']",
          popover: {
            title: "Your Financial Overview",
            description:
              "Here you can see your total balance, income, and expenses at a glance. This gives you a quick snapshot of your financial health.",
            side: "bottom",
            align: "start",
          },
        },
        {
          element: "[data-tutorial='ai-advice']",
          popover: {
            title: "AI-Powered Financial Advice",
            description:
              "Get personalized financial advice based on your spending patterns. Our AI analyzes your data to provide helpful insights and recommendations.",
            side: "bottom",
            align: "start",
          },
        },
        {
          element: "[data-tutorial='add-buttons']",
          popover: {
            title: "Add Income & Expenses",
            description:
              "Use these buttons to quickly add new income or expense transactions. This is how you'll track your money flow.",
            side: "bottom",
            align: "start",
          },
        },
        {
          element: "[data-tutorial='charts']",
          popover: {
            title: "Visual Analytics",
            description:
              "These charts show your spending by category and trends over time. They help you understand your financial patterns better.",
            side: "top",
            align: "start",
          },
        },
        {
          element: "[data-tutorial='settings-button']",
          popover: {
            title: "Settings & Test Mode",
            description:
              "Click the settings button to access additional features, including Test Mode! This feature lets you experiment with the app using sample data without affecting your real finances. Perfect for learning how everything works!",
            side: "bottom",
            align: "start",
          },
        },
        {
          element: "[data-tutorial='navigation']",
          popover: {
            title: "Navigation",
            description:
              "Use the navigation to switch between Dashboard and Movements. The movements page shows all your transactions with filtering options.",
            side: "bottom",
            align: "start",
          },
        },
      ];

      const mobileSteps = [
        {
          element: "[data-tutorial='mobile-menu-button']",
          popover: {
            title: "Mobile Navigation & Settings",
            description:
              "Tap this menu button to access navigation (Dashboard and Movements) and settings including Test Mode! This is where you'll find all the app features on mobile devices. Perfect for exploring the app safely!",
            side: "bottom",
            align: "start",
          },
        },
      ];

      return isMobile()
        ? [...baseSteps.slice(0, 5), ...mobileSteps]
        : baseSteps;
    };

    driverRef.current = driver({
      showProgress: true,
      showButtons: ["next", "previous", "close"],
      progressText: "Step {{current}} of {{total}}",
      nextBtnText: "Next",
      prevBtnText: "Previous",
      doneBtnText: "Finish",
      closeBtnText: "Skip",
      overlayColor: "rgba(0, 0, 0, 0.5)",
      popoverClass: "driverjs-theme",
      steps: getTutorialSteps(),
    });

    return () => {
      if (driverRef.current) {
        driverRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (searchParams.get("showTutorial") === "true" && driverRef.current) {
      driverRef.current.drive();

      const url = new URL(window.location);
      url.searchParams.delete("showTutorial");
      window?.history.replaceState({}, "", url);
    }
  }, [searchParams]);

  const startTutorial = () => {
    if (driverRef.current) {
      driverRef.current.drive();
    }
  };

  return (
    <button
      onClick={startTutorial}
      data-tutorial-trigger
      className="hidden"
      aria-hidden="true"
    >
      Hidden Tutorial Trigger
    </button>
  );
}
