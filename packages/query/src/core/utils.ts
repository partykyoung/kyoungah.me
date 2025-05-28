/**
 * 두 값이 부분적으로 일치하는지 확인해주는 함수입니다.
 * a에 b의 모든 속성이 일치하면 true를 반환합니다.
 * 재귀적으로 객체의 모든 속성을 비교하여 확인하는 함수입니다.
 * @param a 비교할 첫 번째 값입니다.
 * @param b 비교할 두 번째 값입니다. (이 값의 속성들이 a에 있는지 확인합니다.)
 * @returns 일치하면 true, 아니면 false를 반환합니다.
 */
export function partialMatchKey(a: unknown, b: unknown): boolean {
  // a와 b가 완전히 같으면 바로 true를 반환합니다.
  if (a === b) {
    return true;
  }

  // 타입이 다르면 비교할 필요 없이 false를 반환합니다.
  if (typeof a !== typeof b) {
    return false;
  }

  // a와 b가 둘 다 객체인 경우 재귀적으로 내부 속성을 비교합니다.
  if (a && b && typeof a === "object" && typeof b === "object") {
    // b의 모든 키가 a에도 존재하고 그 값도 일치하는지 확인합니다.
    return Object.keys(b as Record<string, unknown>).every((key) =>
      partialMatchKey(
        (a as Record<string, unknown>)[key],
        (b as Record<string, unknown>)[key]
      )
    );
  }

  // 위 조건에 해당되지 않으면 일치하지 않는 것으로 판단하여 false를 반환합니다.
  return false;
}

/**
 * 주어진 값이 Object 프로토타입을 가지고 있는지 확인하는 함수입니다.
 * @param o 확인할 값입니다.
 * @returns Object 프로토타입을 가진 경우 true, 아니면 false를 반환합니다.
 */
function hasObjectPrototype(o: unknown): boolean {
  return Object.prototype.toString.call(o) === "[object Object]";
}

/**
 * 주어진 객체가 일반적인 객체인지 확인하는 함수입니다.
 * @param o 확인할 객체입니다.
 * @returns 일반 객체이면 true, 아니면 false를 반환합니다.
 */
export function isPlainObject(o: unknown): boolean {
  if (hasObjectPrototype(o) === false) {
    return false;
  }

  // Record<string, unknown> 타입으로 변환하여 작업
  const obj = o as Record<string, unknown>;

  // 생성자가 없는 경우 일반 객체로 간주합니다.
  const ctor = obj.constructor;
  if (ctor === undefined) {
    return true;
  }

  // 프로토타입이 수정된 경우 일반 객체가 아닙니다.
  const prot = (ctor as { prototype: unknown }).prototype;
  if (!hasObjectPrototype(prot)) {
    return false;
  }

  // 생성자에 Object 특유의 메소드가 없는 경우 일반 객체가 아닙니다.
  if (Object.prototype.hasOwnProperty.call(prot, "isPrototypeOf") === false) {
    return false;
  }

  // Object.create를 통해 임의의 프로토타입으로 생성된 객체를 처리합니다.
  if (Object.getPrototypeOf(o) !== Object.prototype) {
    return false;
  }

  // 위 모든 조건을 통과하면 일반 객체일 가능성이 높습니다.
  return true;
}

/**
 * 쿼리 키를 해시 문자열로 변환하는 함수입니다.
 * 객체인 경우 키를 정렬하여 일관된 해시 값을 생성합니다.
 * @param queryKey 해시할 쿼리 키입니다.
 * @returns 해시된 문자열을 반환합니다.
 */
export function hashKey(queryKey: unknown): string {
  return JSON.stringify(queryKey, (_, val) =>
    isPlainObject(val)
      ? Object.keys(val as Record<string, unknown>)
          .sort()
          .reduce(
            (result, key) => {
              result[key] = (val as Record<string, unknown>)[key];
              return result;
            },
            {} as Record<string, unknown>
          )
      : val
  );
}

/**
 * 옵션에 따라 쿼리 키를 해시하는 함수입니다.
 * 옵션에 해시 함수가 지정되어 있으면 해당 함수를 사용하고, 그렇지 않으면 기본 해시 함수를 사용합니다.
 * @param queryKey 해시할 쿼리 키입니다.
 * @param options 해시 옵션입니다. queryKeyHashFn이 포함될 수 있습니다.
 * @returns 해시된 문자열을 반환합니다.
 */
export function hashQueryKeyByOptions(
  queryKey: unknown,
  options?: Record<string, unknown>
): string {
  const hashFn =
    (options?.queryKeyHashFn as (key: unknown) => string) || hashKey;
  return hashFn(queryKey);
}

export const skipToken = Symbol();

export function isValidTimeout(value: unknown): value is number {
  return typeof value === "number" && value >= 0 && value !== Infinity;
}
