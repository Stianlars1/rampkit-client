import { logEvent } from "firebase/analytics";
import { getFirebaseAnalytics } from "@/lib/firebase/config";
import { ANALYTICS_EVENTS, AnalyticsEvent } from "./events";

interface AnalyticsParams {
  [key: string]: string | number | boolean;
}

export const trackEvent = (
  eventName: AnalyticsEvent,
  parameters?: AnalyticsParams,
): void => {
  const analytics = getFirebaseAnalytics();

  if (!analytics) {
    console.warn("Analytics not available");
    return;
  }

  try {
    // Type assertion to bypass Firebase's strict typing
    // make lint ignore next line
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    logEvent(analytics, eventName as any, parameters);

    if (process.env.NODE_ENV === "development") {
      console.log(`Analytics: ${eventName}`, parameters);
    }
  } catch (error) {
    console.error("Analytics tracking error:", error);
  }
};

export const trackPageView = (pageName: string): void => {
  trackEvent(ANALYTICS_EVENTS.PAGE_VIEW, {
    page_title: pageName,
    page_location: window.location.href,
  });
};

export const trackUserEngagement = (engagementType: string): void => {
  trackEvent(ANALYTICS_EVENTS.USER_ENGAGEMENT, {
    engagement_type: engagementType,
  });
};
