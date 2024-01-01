import { AuthContext } from "@/context/AuthContext"
import { useContext, useState, useEffect } from "react"
import Draft from "@/components/Draft";
import SaveDraft from "@/components/SaveDraft";
import { getUserDrafts } from "@/firebase/functions";

export default function UserDrafts() {
    const [drafts, setDrafts] = useState<string[]>([]);
    const user = useContext(AuthContext);
    
    useEffect(() => {
        const getDrafts = async () => {
            if(user){
                try {
                    let drafts:any = []
                    let temp = await getUserDrafts(user.uid);
                    drafts = temp
                    setDrafts(drafts);
                } catch (error) {
                    console.log(error)
                }
                
            }
        }
        getDrafts()
    }, [user])

    if(!user) return (<div>loading</div>)

    return (
        <div className="w-full h-1/12 flex flex-row justify-end p-5">
            
            {drafts && drafts.length != 0 && drafts.map((draft:any) => <Draft key={draft} url={draft} setDrafts={setDrafts}/>)}
            <SaveDraft setDrafts={setDrafts}/>
        </div>
    )
}
