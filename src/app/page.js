"use client"

import { useState, useEffect } from "react";
import { rando } from "@nastyox/rando.js";
import { MdContentCopy, MdOutlineQuestionMark } from "react-icons/md";
import { RxLetterCaseCapitalize, RxLetterCaseLowercase, RxLetterCaseUppercase } from "react-icons/rx";
import { IoIosClose } from "react-icons/io";

import Link from "next/link";

export default function Home() {
  const [password, setPassword] = useState("hello niga");
  const [rawPassword, setRawPassword] = useState("");
  const [length, setLength] = useState(12);
  const [letters, setLetters] = useState({
    enabled: true,
    all: true,
    include: false,
    includeBody: "",
    exclude: false,
    excludeBody: "",
    frequency: .75,
    capitalize: 0,
  });
  const [digits, setDigits] = useState({
    enabled: false,
    all: true,
    include: false,
    includeBody: "",
    exclude: false,
    excludeBody: "",
    frequency: .5,
  });
  const [symbols, setSymbols] = useState({
    enabled: false,
    all: true,
    include: false,
    includeBody: "",
    exclude: false,
    excludeBody: "",
    frequency: .25,
  });
  const [messages, setMessages] = useState({
    copied: false,
    help: false,
  });
  const [scrolled, setScrolled] = useState(false);
  const [pulse, setPulse] = useState(false);

  const generatePassword = () => {
    const all_letters_lwr = "abcdefghijklmnopqrstuvwxyz";
    const all_letters_upr = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const all_digits = "0123456789";
    const all_symbols = "!@#$%^&*()_+{}[]|:';<>,.?/~`-=";
    let allowed = "";
    let password = "";

    if(letters.enabled) {
      if(letters.all)
        allowed += all_letters_lwr + all_letters_upr;
      else {
        if(letters.include)
          allowed += letters.includeBody;
        else
          allowed += (all_letters_lwr + all_letters_upr).split("").filter(e => !letters.excludeBody.includes(e)).join("");
      }
    }

    if(digits.enabled) {
      if(digits.all)
        allowed += all_digits;
      else {
        if(digits.include)
          allowed += digits.includeBody;
        else
          allowed += all_digits.split("").filter(e => !digits.excludeBody.includes(e)).join("");
      }
    }

    if(symbols.enabled) {
      if(symbols.all)
        allowed += all_symbols;
      else {
        if(symbols.include)
          allowed += symbols.includeBody;
        else
          allowed += all_symbols.split("").filter(e => !symbols.excludeBody.includes(e)).join("");
      }
    }

    const totalFreq = +letters.frequency + +digits.frequency + +symbols.frequency;
    const letterFreq = +letters.frequency / totalFreq;
    const digitFreq = +digits.frequency / totalFreq;
    const symbolFreq = +symbols.frequency / totalFreq;
    let letterCount = Math.floor(length * letterFreq);
    let digitCount = Math.floor(length * digitFreq);
    let symbolCount = Math.floor(length * symbolFreq);

    if(length >= 8) {
      if(letterFreq > 0 && letterCount == 0)
        letterCount = 1;
      if(digitFreq > 0 && digitCount == 0)
        digitCount = 1;
      if(symbolFreq > 0 && symbolCount == 0)
        symbolCount = 1;
    }

    let remaining = length - (letterCount + digitCount + symbolCount);

    while(remaining > 0) {
      if(remaining > 0 && rando() < letterFreq)
        letterCount++;
      else if(remaining > 0 && rando() < digitFreq)
        digitCount++;
      else if(remaining > 0)
        symbolCount++;

      remaining--;
    }

    const fill = (chars, count) => {
      let result = "";

      for(let i = 0; i < count; i++)
          result += rando(chars);

      return result;
    };

    password = (fill(all_letters_lwr, letterCount) + fill(all_digits, digitCount) + fill(all_symbols, symbolCount))
      .split("")
      .sort(() => .5 - rando())
      .join("");

    if(letters.capitalize == 1)
      password = password.toLowerCase();
    else if(letters.capitalize == 2)
      password = password.toUpperCase();

    return password;
  };

  const reset = () => {
    setPassword("");
    setLength(12);
    setLetters({
      enabled: true,
      all: true,
      include: false,
      includeBody: "",
      exclude: false,
      excludeBody: "",
      frequency: .75,
      capitalize: 0,
    });
    setDigits({
      enabled: false,
      all: true,
      include: false,
      includeBody: "",
      exclude: false,
      excludeBody: "",
      frequency: .5,
    });
    setSymbols({
      enabled: false,
      all: true,
      include: false,
      includeBody: "",
      exclude: false,
      excludeBody: "",
      frequency: .25,
    });
    setMessages({
      copied: false,
      help: false,
    });
  };

  const handleCaseChange = (n) => {
    setLetters({...letters, capitalize: n});
    setPassword(n == 0 ? rawPassword : n == 1 ? password.toLowerCase() : password.toUpperCase());
  };

  const handleDuplicateCharacters = (e, n) => {
    let { value } = e.target;

    if(n <= 1)
      value = value.replace(/[^a-zA-Z]/g, "");
    else if(n > 1 && n <= 3)
      value = value.replace(/[^0-9]/g, "");
    else
      value = value.replace(/[^!@#$%^&*()_+{}[\]|:';<>.,?/~`\-=\[\]]/g, '');

    const unique = [...new Set(value)].join("");

    switch(n) {
      case 0:
        setLetters(prevLetters => ({...prevLetters, includeBody: unique}));
        break;
      case 1:
        setLetters(prevLetters => ({...prevLetters, excludeBody: unique}));
        break;
      case 2:
        setDigits(prevDigits => ({...prevDigits, includeBody: unique}));
        break;
      case 3:
        setDigits(prevDigits => ({...prevDigits, excludeBody: unique}));
        break;
      case 4:
        setSymbols(prevSymbols => ({...prevSymbols, includeBody: unique}));
        break;
      case 5:
        setSymbols(prevSymbols => ({...prevSymbols, excludeBody: unique}));
        break;
    }
  };

  const handleRadioLetters = (e) => {
    const { value } = e.target;

    setLetters(prevLetters => ({
      ...prevLetters,
      all: value == "all",
      include: value == "include",
      exclude: value == "exclude",
    }));
  };

  const handleRadioDigits = (e) => {
    const { value } = e.target;

    setDigits(prevDigits => ({
      ...prevDigits,
      all: value == "all",
      include: value == "include",
      exclude: value == "exclude",
    }));
  };

  const handleRadioSymbols = (e) => {
    const { value } = e.target;

    setSymbols(prevSymbols => ({
      ...prevSymbols,
      all: value == "all",
      include: value == "include",
      exclude: value == "exclude",
    }));
  };

  const valid = (length >= 3 && length <= 48) && (letters.frequency >= 0 && letters.frequency <= 1) && (letters.enabled || digits.enabled || symbols.enabled) && (!letters.include || (letters.include && letters.includeBody.length)) && (!letters.exclude || (letters.exclude && letters.excludeBody.length)) && (!digits.include || (digits.include && digits.includeBody.length)) && (!digits.exclude || (digits.exclude && digits.excludeBody.length)) && (!symbols.include || (symbols.include && symbols.includeBody.length)) && (!symbols.exclude || (symbols.exclude && symbols.excludeBody.length));

  useEffect(() => {
    const handleScroll = () => {
      if(window.scrollY > 8)
        setScrolled(true);
      else
        setScrolled(false);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [messages.help]);

  useEffect(() => {
    setPulse(true);

    const timeout = setTimeout(() => {
      setPulse(false);
    }, 500);

    return () => clearTimeout(timeout);
  }, [password]);

  return (
    <div className="h-full grid place-items-center">
      <div className="flex flex-col-reverse gap-2 p-4">
        {messages.help && (
          <div className="w-80 xs:w-96 h-fit p-6 border rounded-lg bg-white">
            <h2 className="mb-1">About</h2>
            <p className="mb-2">This website uses a pseudo-random algorithm to generate random passwords each time while letting you customize the length and characters used.</p>
            <p className="mb-5">
              It's ideal for casual use, but not suitable for situations where maximum security is required.&nbsp;
              <Link target="_blank" href="https://kemilbeltre.medium.com/why-do-not-use-math-random-a6f8b0ad38dd" className="font-semibold text-indigo-500 hover:underline underline-offset-2">
                Learn More
              </Link>
            </p>
            <p>
              Made with ❤️ by&nbsp;
              <Link target="_blank" href="https://www.instagram.com/soringvr/" className="font-semibold text-indigo-500 hover:underline underline-offset-2">
                Sorin Gavra
              </Link>
            </p>
          </div>
        )}
        <div className="w-full lg:w-auto">
          <div className={`${scrolled ? "drop-shadow-2xl" : ""} w-80 xs:w-auto flex flex-col gap-2 z-10 mb-2 transition-all sticky top-4`}>
            <div className="flex flex-col xs:flex-row gap-2 transition-all">
              <input type="text" onChange={(e) => setPassword(e.target.value)} value={password} placeholder="Password" spellCheck="false" className={`${pulse ? "text-indigo-500" : "text-neutral-600"} min-w-full xs:min-w-fit font-medium tracking-widest text-center transition-colors duration-500`} />
              <div className="flex flex-row gap-2">
                <button onClick={() => {navigator.clipboard.writeText(password); setMessages(prevMessages => ({...prevMessages, copied: true}))}} title="Copy to clipboard" className={`${!password.length ? "hidden" : ""} button-icon`}>
                  <MdContentCopy />
                </button>
                <div className="w-full xs:w-auto flex gap-2 p-2 border outline-2 outline-offset-2 outline-indigo-500 rounded-lg bg-white focus-within:outline">
                  <button onClick={() => handleCaseChange(0)} title="Default password" className="no-outline flex justify-center flex-1 xs:flex-auto rounded-none pr-2 border-r group">
                    <RxLetterCaseCapitalize className={letters.capitalize == 0 ? "text-indigo-500" : "text-neutral-400"} />
                  </button>
                  <button onClick={() => handleCaseChange(1)} title="Lowercase password" className="no-outline flex justify-center flex-1 xs:flex-auto rounded-none pr-2 border-r group">
                    <RxLetterCaseLowercase className={letters.capitalize == 1 ? "text-indigo-500" : "text-neutral-400"} />
                  </button>
                  <button onClick={() => handleCaseChange(2)} title="Uppercase password" className="no-outline flex justify-center flex-1 xs:flex-auto group">
                    <RxLetterCaseUppercase className={letters.capitalize == 2 ? "text-indigo-500" : "text-neutral-400"} />
                  </button>
                </div>
              </div>
            </div>
            {messages.copied && (
              <div className="flex justify-between items-center px-3 py-2.5 pr-0 border rounded-lg bg-white">
                <p className="font-semibold text-indigo-500 leading-5">Copied to clipboard!</p>
                <button onClick={() => setMessages(prevMessages => ({...prevMessages, copied: false}))} title="Hide" className="no-outline px-2 rounded-none border-l">
                  <IoIosClose className="size-5" />
                </button>
              </div>
            )}
          </div>
          <div className="w-80 xs:w-auto p-6 border rounded-lg bg-white">
            <div className="flex flex-col mb-4">
              <h2 className="mb-1">Random Password Generator</h2>
              <p className="max-w-[30rem]">This tool can generate random password based on parameters set by you. You can adjust the password length, and specify the inclusion of letters, numbers, and symbols.</p>
            </div>
            <p className="font-semibold text-lg">Length</p>
            <div className="flex gap-4 mb-4">
              <input type="range" onChange={(e) => setLength(e.target.value)} min={3} max={48} value={length} className="w-full text-neutral-600" />
              <input type="tel" onChange={(e) => setLength(e.target.value)} onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, "")} value={length} maxLength={2} spellCheck="false" className={`${(length < 3 || length > 48) ? "outline-rose-500" : "outline-indigo-500"} w-12 text-neutral-600 text-center`} />
            </div>
            <p className="font-semibold text-lg mb-1">Characters</p>
            <div className="flex flex-col md:flex-row gap-x-4 gap-y-2 mb-8">
              <div className="pr-4 border-0 md:border-r">
                <div className={`${letters.enabled ? "pb-2 mb-2 border-b" : ""} flex items-center gap-2`}>
                  <input type="checkbox" checked={letters.enabled} onChange={() => setLetters(prevLetters => ({...prevLetters, enabled: !prevLetters.enabled}))} />
                  <label>Letters</label>
                </div>
                {letters.enabled && (
                  <>
                    <div className="flex items-center gap-2 mb-1">
                      <input type="radio" value="all" checked={letters.all} onChange={handleRadioLetters} />
                      <label>All letters</label>
                    </div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <input type="radio" value="include" checked={letters.include} onChange={handleRadioLetters} />
                      <label>Only these letters:</label>
                    </div>
                    <input type="text" disabled={!letters.include} onChange={(e) => handleDuplicateCharacters(e, 0)} value={letters.includeBody} placeholder="eg. abcDEF" spellCheck="false" className="w-full text-neutral-600 tracking-wider mb-2" />
                    <div className="flex items-center gap-2 mb-1.5">
                      <input type="radio" value="exclude" checked={letters.exclude} onChange={handleRadioLetters} />
                      <label>All letters, except:</label>
                    </div>
                    <input type="text" disabled={!letters.exclude} onChange={(e) => handleDuplicateCharacters(e, 1)} value={letters.excludeBody} placeholder="eg. abcDEF" spellCheck="false" className="w-full text-neutral-600 tracking-wider mb-2" />
                    <p>Frequency</p>
                    <div className="flex gap-4 mb-6 md:mb-0">
                      <input type="range" onChange={(e) => setLetters(prevLetters => ({...prevLetters, frequency: e.target.value}))} min={0.1} max={1} step={.01} value={letters.frequency} className="w-full" />
                      <input type="tel" onChange={(e) => setLetters(prevLetters => ({...prevLetters, frequency: e.target.value}))} onInput={(e) => e.target.value = e.target.value.replace(/[^0-9.]/g, "")} value={letters.frequency} maxLength={4} spellCheck="false" className={`${(letters.frequency < 0.1 || letters.frequency > 1) ? "outline-rose-500" : "outline-indigo-500"} w-16 text-neutral-600 text-center`} />
                    </div>
                  </>
                )}
              </div>
              <div className="pr-4 border-0 md:border-r">
                <div className={`${digits.enabled ? "pb-2 mb-2 border-b" : ""} flex items-center gap-2`}>
                  <input type="checkbox" checked={digits.enabled} onChange={() => setDigits(prevDigits => ({...prevDigits, enabled: !prevDigits.enabled}))} />
                  <label>Digits</label>
                </div>
                {digits.enabled && (
                  <>
                    <div className="flex items-center gap-2 mb-1">
                      <input type="radio" value="all" checked={digits.all} onChange={handleRadioDigits} />
                      <label>All digits</label>
                    </div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <input type="radio" value="include" checked={digits.include} onChange={handleRadioDigits} />
                      <label>Only these digits:</label>
                    </div>
                    <input type="text" disabled={!digits.include} onChange={(e) => handleDuplicateCharacters(e, 2)} value={digits.includeBody} placeholder="eg. 0123" spellCheck="false" className="w-full text-neutral-600 tracking-wider mb-2" />
                    <div className="flex items-center gap-2 mb-1.5">
                      <input type="radio" value="exclude" checked={digits.exclude} onChange={handleRadioDigits} />
                      <label>All digits, except:</label>
                    </div>
                    <input type="text" disabled={!digits.exclude} onChange={(e) => handleDuplicateCharacters(e, 3)} value={digits.excludeBody} placeholder="eg. 0123" spellCheck="false" className="w-full text-neutral-600 tracking-wider mb-2" />
                    <p>Frequency</p>
                    <div className="flex gap-4 mb-6 md:mb-0">
                      <input type="range" onChange={(e) => setDigits(prevDigits => ({...prevDigits, frequency: e.target.value}))} min={0.1} max={1} step={.01} value={digits.frequency} className="w-full" />
                      <input type="tel" onChange={(e) => setDigits(prevDigits => ({...prevDigits, frequency: e.target.value}))} onInput={(e) => e.target.value = e.target.value.replace(/[^0-9.]/g, "")} value={digits.frequency} maxLength={4} spellCheck="false" className={`${(digits.frequency < 0.1 || digits.frequency > 1) ? "outline-rose-500" : "outline-indigo-500"} w-16 text-neutral-600 text-center`} />
                    </div>
                  </>
                )}
              </div>
              <div>
                <div className={`${symbols.enabled ? "pb-2 mb-2 border-b" : ""} flex items-center gap-2`}>
                  <input type="checkbox" checked={symbols.enabled} onChange={() => setSymbols(prevSymbols => ({...prevSymbols, enabled: !prevSymbols.enabled}))} />
                  <label>Symbols</label>
                </div>
                {symbols.enabled && (
                  <>
                    <div className="flex items-center gap-2 mb-1">
                      <input type="radio" value="all" checked={symbols.all} onChange={handleRadioSymbols} />
                      <label>All symbols</label>
                    </div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <input type="radio" value="include" checked={symbols.include} onChange={handleRadioSymbols} />
                      <label>Only these symbols:</label>
                    </div>
                    <input type="text" disabled={!symbols.include} onChange={(e) => handleDuplicateCharacters(e, 4)} value={symbols.includeBody} placeholder="eg. /;'!" spellCheck="false" className="w-full text-neutral-600 tracking-wider mb-2" />
                    <div className="flex items-center gap-2 mb-1.5">
                      <input type="radio" value="exclude" checked={symbols.exclude} onChange={handleRadioSymbols} />
                      <label>All symbols, except:</label>
                    </div>
                    <input type="text" disabled={!symbols.exclude} onChange={(e) => handleDuplicateCharacters(e, 5)} value={symbols.excludeBody} placeholder="eg. /;'!" spellCheck="false" className="w-full text-neutral-600 tracking-wider mb-2" />
                    <p>Frequency</p>
                    <div className="flex gap-4 mb-6 md:mb-0">
                      <input type="range" onChange={(e) => setSymbols(prevSymbols => ({...prevSymbols, frequency: e.target.value}))} min={0.1} max={1} step={.01} value={symbols.frequency} className="w-full" />
                      <input type="tel" onChange={(e) => setLetters(prevSymbols => ({...prevSymbols, frequency: e.target.value}))} onInput={(e) => e.target.value = e.target.value.replace(/[^0-9.]/g, "")} value={symbols.frequency} maxLength={4} spellCheck="false" className={`${(symbols.frequency < 0.1 || symbols.frequency > 1) ? "outline-rose-500" : "outline-indigo-500"} w-16 text-neutral-600 text-center`} />
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="flex flex-col-reverse xs:flex-row justify-between gap-2">
              <button onClick={() => setMessages(prevMessages => ({...prevMessages, help: !prevMessages.help}))} title="About" className={`${messages.help ? "button-active-opacity" : ""} button-icon hidden xs:grid`}>
                <MdOutlineQuestionMark />
              </button>
              <div className="flex flex-col-reverse xs:flex-row gap-2">
                <div className="flex xs:block gap-2">
                  <button onClick={() => setMessages(prevMessages => ({...prevMessages, help: !prevMessages.help}))} title="About" className={`${messages.help ? "button-active-opacity" : ""} button-icon grid xs:hidden`}>
                  <MdOutlineQuestionMark />
                  </button>
                  <button onClick={reset} className="button-text button-border flex-1">Reset</button>
                </div>
                <button onClick={() => {const a = generatePassword(); setPassword(a); setRawPassword(a); setMessages(prevMessages => ({...prevMessages, copied: false}))}} disabled={!valid} className="button-text button-filled px-16">Generate</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
