import ChatInput from "./ChatInput";
import ChatResponse from "./ChatResponse";
import LanguageSelector from "./LanguageSelector";
import LoadingScreen from "./Loading";
import useChatAppHook from "../hooks/useChatAppHook";

export default function Homepage(){

    const {response,loading,sourceLang,setSourceLang,targetLang,setTargetLang,handleSubmitApi,} =
   useChatAppHook();

    return (
        <>
        <LanguageSelector sourceLang={sourceLang} setSourceLang={setSourceLang} 
               targetLang={targetLang}  setTargetLang={setTargetLang}/>
          <div className="chat-container">
          <div className="chat-input-container">
          <ChatInput onSend={handleSubmitApi} />
           </div>
           <div className="chat-response-container">
        <div> {loading ? (<LoadingScreen/>) : ( <ChatResponse response={response}
         loading = {loading}  />)}
        </div>
        </div>
      </div>
        
        </>
    )
}