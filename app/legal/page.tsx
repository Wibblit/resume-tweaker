import React from "react";
import LegalPoliciesGrid from "@/components/legal-policies-grid";

export default function legalPage(){
    return (
        <div className="min-h-screen bg-background py-28 px-4 sm:p-6 lg:p-28">
            <LegalPoliciesGrid/>
        </div>
    )
}