import { useAuth } from "../../security/AuthContext";
import { useToken } from "../../security/TokenContext";

export default function LanguageSelector({
  sourceLang,
  setSourceLang,
  targetLang,
  setTargetLang,
}) {
  const languages = [
    "Java", "Python", "JavaScript", "C++", "C#", "Ruby", "PHP", "Swift", "Kotlin",
    "Go", "Rust", "TypeScript", "Perl", "Scala", "Haskell", "R", "Dart", "Lua",
    "MATLAB", "Groovy", "Objective-C", "Shell", "PowerShell", "COBOL", "Fortran",
    "Ada", "Erlang", "Elixir", "Visual Basic", "F#", "Pascal", "Assembly",
    "Prolog", "Scheme", "VHDL", "Verilog", "Smalltalk", "ABAP", "Crystal",
    "Nim", "AWK", "Clojure", "Julia", "Delphi", "Tcl", "APL", "OCaml", "Solidity",
    "Q#", "Scratch", "ColdFusion"
  ];

  const {currentPlan} = useToken()
  const {isLoggedOut} = useAuth()

  const languageslite = [
    "Java", "Python", "JavaScript", "C++"
  ];

  let availableLanguages = languageslite;

  if(!isLoggedOut){
     availableLanguages = currentPlan === 'SUPER' ? languages : languageslite;
  }

  return (
    <div className="languageSelector d-flex justify-content-center my-3">
      <select
        value={sourceLang}
        onChange={(e) => setSourceLang(e.target.value)}
        className="form-select language-dropdown m-2"
      >
        {availableLanguages.map((lang, index) => (
          <option key={index} value={lang.toLowerCase()}>
            {lang}
          </option>
        ))}
      </select>

      <span className="text-white mx-5">To</span>

      <select
        value={targetLang}
        onChange={(e) => setTargetLang(e.target.value)}
        className="form-select language-dropdown m-2"
      >
        {availableLanguages.map((lang, index) => (
          <option key={index} value={lang.toLowerCase()}>
            {lang}
          </option>
        ))}
      </select>
    </div>
  );
}
