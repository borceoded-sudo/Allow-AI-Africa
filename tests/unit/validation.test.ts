import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  contactSchema,
  subscribeSchema,
  HONEYPOT_FIELD,
} from "../../src/lib/validation.ts";

const valid = {
  firstName: "Ada",
  lastName: "Nwosu",
  email: "ada@example.com",
  organisation: "Sahara Bank",
  phone: "+254200000000",
  message: "We would like to discuss forecasting models.",
};

describe("contactSchema", () => {
  test("accepts a complete submission", () => {
    assert.equal(contactSchema.safeParse(valid).success, true);
  });

  test("accepts a submission with only the required fields", () => {
    const result = contactSchema.safeParse({
      firstName: "Ada",
      email: "ada@example.com",
      message: "Ten characters or more.",
    });
    assert.equal(result.success, true);
  });

  test("treats empty optional fields as absent", () => {
    const result = contactSchema.safeParse({
      ...valid,
      lastName: "",
      organisation: "",
      phone: "",
    });
    assert.equal(result.success, true);
  });

  test("rejects a malformed email", () => {
    const result = contactSchema.safeParse({ ...valid, email: "not-an-email" });
    assert.equal(result.success, false);
    assert.equal(result.error?.issues[0].path[0], "email");
  });

  test("rejects a message under ten characters", () => {
    const result = contactSchema.safeParse({ ...valid, message: "short" });
    assert.equal(result.success, false);
    assert.match(result.error!.issues[0].message, /10 characters/);
  });

  test("rejects a blank name once trimmed", () => {
    assert.equal(
      contactSchema.safeParse({ ...valid, firstName: "   " }).success,
      false,
    );
  });

  test("trims surrounding whitespace", () => {
    const result = contactSchema.safeParse({
      ...valid,
      firstName: "  Ada  ",
      email: "  ada@example.com  ",
    });
    assert.equal(result.success, true);
    assert.equal(result.data?.firstName, "Ada");
    assert.equal(result.data?.email, "ada@example.com");
  });

  test("rejects an over-long message", () => {
    const result = contactSchema.safeParse({
      ...valid,
      message: "x".repeat(4001),
    });
    assert.equal(result.success, false);
  });

  /**
   * The honeypot must stay outside the schema. If it were a field, a bot that
   * filled it would get a validation error naming the field — telling it
   * exactly which input to leave alone next time.
   */
  test("ignores the honeypot field entirely", () => {
    const result = contactSchema.safeParse({
      ...valid,
      [HONEYPOT_FIELD]: "http://spam.example",
    });
    assert.equal(result.success, true);
    assert.equal(HONEYPOT_FIELD in (result.data ?? {}), false);
  });
});

describe("subscribeSchema", () => {
  test("accepts a valid email", () => {
    assert.equal(
      subscribeSchema.safeParse({ email: "ada@example.com" }).success,
      true,
    );
  });

  test("rejects a malformed email", () => {
    assert.equal(subscribeSchema.safeParse({ email: "nope" }).success, false);
  });

  test("ignores the honeypot field entirely", () => {
    const result = subscribeSchema.safeParse({
      email: "ada@example.com",
      [HONEYPOT_FIELD]: "http://spam.example",
    });
    assert.equal(result.success, true);
    assert.equal(HONEYPOT_FIELD in (result.data ?? {}), false);
  });
});
