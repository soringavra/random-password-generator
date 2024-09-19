"use client"

import { useState } from "react";
import { rando } from "@nastyox/rando.js";
import { MdContentCopy, MdOutlineQuestionMark } from "react-icons/md";
import { RxLetterCaseCapitalize, RxLetterCaseLowercase, RxLetterCaseUppercase } from "react-icons/rx";

import Link from "next/link";

export default function Home() {
  const [password, setPassword] = useState("");
  const [rawPassword, setRawPassword] = useState("");
  const [length, setLength] = useState(12);
  const [letters, setLetters] = useState({
    enabled: true,
    all: true,
    include: false,
    includeBody: "",
    exclude: false,
    excludeBody: "",
    capitalize: 0,
  });
  const [digits, setDigits] = useState({
    enabled: false,
    all: true,
    include: false,
    includeBody: "",
    exclude: false,
    excludeBody: "",
  });
  const [symbols, setSymbols] = useState({
    enabled: false,
    all: true,
    include: false,
    includeBody: "",
    exclude: false,
    excludeBody: "",
  });
  const [messages, setMessages] = useState({
    copied: false,
    help: false,
  });

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

    for(let i = 0; i < length; i++)
      password += allowed[rando(0, allowed.length - 1)];

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
      capitalize: 0,
    });
    setDigits({
      enabled: false,
      all: true,
      include: false,
      includeBody: "",
      exclude: false,
      excludeBody: "",
    });
    setSymbols({
      enabled: false,
      all: true,
      include: false,
      includeBody: "",
      exclude: false,
      excludeBody: "",
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

  const valid = (length >= 3 && length <= 48) && (letters.enabled || digits.enabled || symbols.enabled) && (!letters.include || (letters.include && letters.includeBody.length)) && (!letters.exclude || (letters.exclude && letters.excludeBody.length)) && (!digits.include || (digits.include && digits.includeBody.length)) && (!digits.exclude || (digits.exclude && digits.excludeBody.length)) && (!symbols.include || (symbols.include && symbols.includeBody.length)) && (!symbols.exclude || (symbols.exclude && symbols.excludeBody.length));

  return (
    <div className="h-full grid place-items-center p-4 overflow-auto">
      <div className="flex flex-col xs:flex-col-reverse lg:flex-row-reverse gap-2">
        {messages.help && (
          <div className="w-80 xs:w-96 h-fit self-end lg:self-auto p-6 border rounded-lg bg-white">
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
              <Link target="_blank" href="https://soringavra.com" className="font-semibold text-indigo-500 hover:underline underline-offset-2">
                Sorin Gavra
              </Link>
            </p>
          </div>
        )}
        <div className="w-full lg:w-auto">
          <div className="w-80 xs:w-auto flex flex-col xs:flex-row gap-2 mb-2">
            <input type="text" onChange={(e) => setPassword(e.target.value)} value={password} placeholder="Password" spellCheck="false" className="min-w-full xs:min-w-fit tracking-wider text-center" />
            <div className="flex flex-row gap-2">
              <button onClick={() => {navigator.clipboard.writeText(password); setMessages(prevMessages => ({...prevMessages, copied: true}))}} title="Copy to clipboard" className="button-icon">
                <MdContentCopy />
              </button>
              <div className="w-full xs:w-auto flex gap-2 p-2 border outline-2 outline-offset-2 outline-indigo-500 rounded-lg bg-white focus-within:outline">
                <button onClick={() => handleCaseChange(0)} title="Default" className="no-outline flex justify-center flex-1 xs:flex-auto rounded-none pr-2 border-r group">
                  <RxLetterCaseCapitalize className={letters.capitalize == 0 ? "text-indigo-500" : "text-neutral-400"} />
                </button>
                <button onClick={() => handleCaseChange(1)} title="Lowercase" className="no-outline flex justify-center flex-1 xs:flex-auto rounded-none pr-2 border-r group">
                  <RxLetterCaseLowercase className={letters.capitalize == 1 ? "text-indigo-500" : "text-neutral-400"} />
                </button>
                <button onClick={() => handleCaseChange(2)} title="Uppercase" className="no-outline flex justify-center flex-1 xs:flex-auto group">
                  <RxLetterCaseUppercase className={letters.capitalize == 2 ? "text-indigo-500" : "text-neutral-400"} />
                </button>
              </div>
            </div>
          </div>
          {messages.copied && <p className="font-semibold text-indigo-500 mb-2">Copied to clipboard!</p>}
          <div className="w-80 xs:w-auto p-6 border rounded-lg bg-white">
            <div className="flex justify-between items-start gap-2 mb-4">
              <div>
                <h2 className="mb-1">Random Password Generator</h2>
                <p className="max-w-[23rem] sm:max-w-[37rem]">Make passwords just the way you want them! Pick the length and choose which letters, digits, and symbols to include or skip.</p>
              </div>
              <button onClick={() => setMessages(prevMessages => ({...prevMessages, help: !prevMessages.help}))} title="About" className={`${messages.help ? "button-active-opacity" : ""} button-icon`}>
                <MdOutlineQuestionMark />
              </button>
            </div>
            <p className="font-semibold text-lg mb-1">Length</p>
            <div className="flex gap-4 mb-4">
              <input type="range" onChange={(e) => setLength(e.target.value)} min={3} max={48} value={length} className="w-full" />
              <input type="number" onChange={(e) => setLength(e.target.value)} onInput={(e) => e.target.value = e.target.value.slice(0, 2)} value={length} spellCheck="false" className={`${(length < 3 || length > 48) ? "outline-rose-500" : "outline-indigo-500"} w-12 text-center`} />
            </div>
            <p className="font-semibold text-lg mb-1">Characters</p>
            <div className="flex flex-col md:flex-row gap-x-8 gap-y-2 mb-8">
              <div>
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
                    <input type="text" disabled={!letters.include} onChange={(e) => handleDuplicateCharacters(e, 0)} value={letters.includeBody} placeholder="eg. abcDEF" spellCheck="false" className="w-full tracking-wider mb-2" />
                    <div className="flex items-center gap-2 mb-1.5">
                      <input type="radio" value="exclude" checked={letters.exclude} onChange={handleRadioLetters} />
                      <label>All letters, except:</label>
                    </div>
                    <input type="text" disabled={!letters.exclude} onChange={(e) => handleDuplicateCharacters(e, 1)} value={letters.excludeBody} placeholder="eg. abcDEF" spellCheck="false" className="w-full tracking-wider mb-6 md:mb-0" />
                  </>
                )}
              </div>
              <div>
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
                    <input type="text" disabled={!digits.include} onChange={(e) => handleDuplicateCharacters(e, 2)} value={digits.includeBody} placeholder="eg. 0123" spellCheck="false" className="w-full tracking-wider mb-2" />
                    <div className="flex items-center gap-2 mb-1.5">
                      <input type="radio" value="exclude" checked={digits.exclude} onChange={handleRadioDigits} />
                      <label>All digits, except:</label>
                    </div>
                    <input type="text" disabled={!digits.exclude} onChange={(e) => handleDuplicateCharacters(e, 3)} value={digits.excludeBody} placeholder="eg. 0123" spellCheck="false" className="w-full tracking-wider mb-6 md:mb-0" />
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
                    <input type="text" disabled={!symbols.include} onChange={(e) => handleDuplicateCharacters(e, 4)} value={symbols.includeBody} placeholder="eg. /;'!" spellCheck="false" className="w-full tracking-wider mb-2" />
                    <div className="flex items-center gap-2 mb-1.5">
                      <input type="radio" value="exclude" checked={symbols.exclude} onChange={handleRadioSymbols} />
                      <label>All symbols, except:</label>
                    </div>
                    <input type="text" disabled={!symbols.exclude} onChange={(e) => handleDuplicateCharacters(e, 5)} value={symbols.excludeBody} placeholder="eg. /;'!" spellCheck="false" className="w-full tracking-wider" />
                  </>
                )}
              </div>
            </div>
            <div className="flex flex-col-reverse xs:flex-row gap-2 justify-end">
              <button onClick={reset} className="button-text button-border">Reset</button>
              <button onClick={() => {const a = generatePassword(); setPassword(a); setRawPassword(a); setMessages(prevMessages => ({...prevMessages, copied: false}))}} disabled={!valid} className="button-text button-filled px-16">Generate</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
