// src/Store/utils/safeParse.js
export const safeParse = (item, defaultValue = []) => {
    const storedItem = localStorage.getItem(item);
    if (!storedItem || storedItem === "undefined") return defaultValue;
    try {
      return JSON.parse(storedItem);
    } catch (e) {
      console.error(`Error parsing ${item} from localStorage:`, e);
      return defaultValue;
    }
  };