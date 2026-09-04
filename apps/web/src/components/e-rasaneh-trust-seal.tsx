"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    eRasaneh_Trustseal?: (certificateId: number, showLogo: boolean) => void;
  }
}

const certificateId = 101661;
const scriptId = "e-rasaneh-trustseal-script";

export function ERasanehTrustSeal() {
  useEffect(() => {
    const initialize = () => {
      window.eRasaneh_Trustseal?.(certificateId, false);
    };

    const existingScript = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (existingScript) {
      if (window.eRasaneh_Trustseal) initialize();
      else existingScript.addEventListener("load", initialize, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://trustseal.e-rasaneh.ir/trustseal.js";
    script.async = true;
    script.addEventListener("load", initialize, { once: true });
    document.body.appendChild(script);
  }, []);

  return <div id={`div_eRasanehTrustseal_${certificateId}`} />;
}
