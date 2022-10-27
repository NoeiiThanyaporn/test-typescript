/**
interface BirdSpec2 {
  legs: number;
  wings: number;
  canWalk: boolean;
  canFly: boolean;
  canSwim?: boolean;
  canSpeak?: boolean;
}
 */
/**
 * สร้าง Generic Type ขึ้นมาใหม่
 * ซึ่งรูปแบบจะเหมือน type BirdSpec2 เมื่อนำไปเรียกใช้
 * T == interface Animal
 * K extends keyof T == myBird2 ที่ทำการ extends Animal มา
 * extends คือการถ่ายทอดคุณสมบัติของ interface หลักมาที่ intterface ย่อย (แม่สู่ลูก โดยที่คุณสมบัตินั้น ๆ อาจจะไม่มาที่ลูกทั้งหมด)
 * Pick<T, K> & Partial<T> ==
 * - Pick<T, K> เลือกคุณสมบัติจากแม่ที่ต้องการนำมาใช้เป็นหลักในลูก
 * - Partial<T> คุณสมบัติอื่น ๆ ของแม่ที่ไม่ได้เลือกให้เป็น optional
 */
export declare type RequiredSome<T, K extends keyof T> = Pick<T, K> & Partial<T>;
