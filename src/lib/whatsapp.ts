// ═══════════════════════════════════════════════
//  WhatsApp Helpers — Centralized message builders
//  Generates EN/AR WhatsApp URLs with context
//  Each message includes car name + URL for agent
// ═══════════════════════════════════════════════

import { APP_CONFIG } from "./config";

const { WA_PHONE, WA_URL, BASE_URL } = APP_CONFIG;

/**
 * Build a full WhatsApp URL with encoded text
 */
function waUrl(text: string): string {
  return `${WA_URL}/${WA_PHONE}?text=${encodeURIComponent(text)}`;
}

/**
 * WhatsApp message for "interest in a car" (CarCards, CarDetail)
 */
export function waCarInterest(params: {
  carName: string;
  carSlug: string;
  locale: "en" | "ar";
}) {
  const { carName, carSlug, locale } = params;
  const carUrl = `${BASE_URL}/${locale === "ar" ? "ar/" : ""}car/${carSlug}/`;

  if (locale === "ar") {
    return waUrl(
      `مرحباً! أود الاستفسار عن ${carName}.\n\n` +
      `🔗 رابط السيارة: ${carUrl}\n\n` +
      `هل يمكنك مشاركة أفضل سعر وتوفر؟`
    );
  }

  return waUrl(
    `Hi! I'm interested in ${carName}.\n\n` +
    `🔗 Car link: ${carUrl}\n\n` +
    `Can you share the best price and availability?`
  );
}

/**
 * WhatsApp message for car detail page WITH pickup/drop info
 */
export function waCarDetailWithDates(params: {
  carName: string;
  carSlug: string;
  pickupLocation: string;
  dropLocation: string;
  pickupDate: string;
  returnDate: string;
  pickupTime: string;
  locale: "en" | "ar";
}) {
  const { carName, carSlug, pickupLocation, dropLocation, pickupDate, returnDate, pickupTime, locale } = params;
  const carUrl = `${BASE_URL}/${locale === "ar" ? "ar/" : ""}car/${carSlug}/`;
  const na = locale === "ar" ? "غير محدد" : "Not set";

  if (locale === "ar") {
    return waUrl(
      `مرحباً! أود الاستفسار عن تأجير ${carName}.\n\n` +
      `🔗 رابط السيارة: ${carUrl}\n` +
      `📍 موقع الاستلام: ${pickupLocation} في ${pickupDate || na} ${pickupTime}\n` +
      `📍 موقع التسليم: ${dropLocation} في ${returnDate || na}\n\n` +
      `هل يمكنك مشاركة أفضل سعر وتوفر؟`
    );
  }

  return waUrl(
    `Hi! I'm interested in renting ${carName}.\n\n` +
    `🔗 Car link: ${carUrl}\n` +
    `📍 Pickup: ${pickupLocation} on ${pickupDate || na} at ${pickupTime}\n` +
    `📍 Drop: ${dropLocation} on ${returnDate || na}\n\n` +
    `Can you share the best price and availability?`
  );
}

/**
 * WhatsApp message for booking form (full details)
 */
export function waBookingRequest(params: {
  carName: string;
  carSlug: string;
  pickupLocation: string;
  dropLocation: string;
  pickupDate: string;
  returnDate: string;
  pickupTime: string;
  returnTime: string;
  depositText: string;
  totalPrice: string;
  fullName: string;
  phone: string;
  email: string;
  notes: string;
  locale: "en" | "ar";
}) {
  const { carName, carSlug, pickupLocation, dropLocation, pickupDate, returnDate, pickupTime, returnTime, depositText, totalPrice, fullName, phone, email, notes, locale } = params;
  const carUrl = `${BASE_URL}/${locale === "ar" ? "ar/" : ""}car/${carSlug}/`;
  const na = locale === "ar" ? "غير محدد" : "Not set";
  const no = locale === "ar" ? "بدون" : "None";

  if (locale === "ar") {
    return waUrl(
      `مرحباً! أود حجز ${carName}.\n\n` +
      `🔗 رابط السيارة: ${carUrl}\n` +
      `📍 الاستلام: ${pickupLocation} في ${pickupDate || na} ${pickupTime}\n` +
      `📍 التسليم: ${dropLocation} في ${returnDate || na} ${returnTime}\n` +
      `💰 الإيداع: ${depositText}\n` +
      `💵 الإجمالي: ${totalPrice}\n\n` +
      `👤 الاسم: ${fullName || na}\n` +
      `📞 الهاتف: ${phone || na}\n` +
      `✉️ البريد: ${email || na}\n` +
      `📝 ملاحظات: ${notes || no}`
    );
  }

  return waUrl(
    `Hi! I'd like to book ${carName}.\n\n` +
    `🔗 Car link: ${carUrl}\n` +
    `📍 Pickup: ${pickupLocation} on ${pickupDate || na} at ${pickupTime}\n` +
    `📍 Drop: ${dropLocation} on ${returnDate || na} at ${returnTime}\n` +
    `💰 Deposit: ${depositText}\n` +
    `💵 Total: ${totalPrice}\n\n` +
    `👤 Name: ${fullName || na}\n` +
    `📞 Phone: ${phone || na}\n` +
    `✉️ Email: ${email || na}\n` +
    `📝 Notes: ${notes || no}`
  );
}

/**
 * WhatsApp message for successful booking (post-booking confirmation check)
 */
export function waBookingSuccess(params: {
  carName: string;
  bookingId: string;
  locale: "en" | "ar";
}) {
  const { carName, bookingId, locale } = params;

  if (locale === "ar") {
    return waUrl(
      `مرحباً! لقد حجزت ${carName}.\n` +
      `رقم الحجز: ${bookingId}\n\n` +
      `هل يمكنك تأكيد حجزي من فضلك؟`
    );
  }

  return waUrl(
    `Hi! I just booked ${carName}.\n` +
    `My booking reference is: ${bookingId}\n\n` +
    `Can you please confirm my booking?`
  );
}

/**
 * WhatsApp message for general inquiry (homepage, contact)
 */
export function waGeneralInquiry(locale: "en" | "ar") {
  if (locale === "ar") {
    return waUrl("مرحباً! أرغب في حجز سيارة فاخرة");
  }
  return waUrl("Hi! I'd like to book a luxury car");
}

/**
 * WhatsApp number only (no message — opens chat)
 */
export function waNumberOnly(): string {
  return `${WA_URL}/${WA_PHONE}`;
}
