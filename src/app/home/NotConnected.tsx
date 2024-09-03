"use client";

import React, { useState } from "react";
import { useTypingEffect } from "@/utils/useTypingEffect";

export function NotConnected() {

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="nes-container is-dark with-title text-sm sm:text-base">
        <span>No Connected</span>
      </div>
    </div>
  );
}
