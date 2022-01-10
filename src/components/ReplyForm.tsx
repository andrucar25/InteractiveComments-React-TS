import { ChangeEvent, FormEvent, useLayoutEffect, useState } from "react";
import { ICurrentUser } from "../interfaces/ICurrentUser";
import { IReply } from "../interfaces/IReply";
import {IUserImage} from "../interfaces/IUserImage";

interface Props{
    currentUser: ICurrentUser;
    addNewReply?:(reply:IReply)=>void;
    usernameComment:string;
}


type HandleInputChange = ChangeEvent<HTMLTextAreaElement>

export default function ReplyForm({currentUser, addNewReply, usernameComment}: Props) {

    const [width, setWidth] = useState<number>(0);

    //Responsive
    useLayoutEffect(() => {
        function updateWidth(){
            setWidth(window.innerWidth);
        }
        window.addEventListener('resize', updateWidth);
        updateWidth();
    }, )
    
   //Destructuring del current user para ingresarlo al state de new comment
   const {image, username}: {image:IUserImage, username:string} = currentUser   

   const initialState = {
       content:'',
       score:0,
       replyingTo:usernameComment,
       user:{image, username}
   }
 
   const [newReply, setNewReply] = useState(initialState);

   const handleInputChange = ({
       target: {name, value}
   }: HandleInputChange ) => {
    setNewReply({...newReply, [name]: value});
   }

   //Accion del boton para agregar nueva tarea
   const handleNewComment = (e:FormEvent<HTMLFormElement>)=>{
       e.preventDefault();
       if(addNewReply !== undefined){
         addNewReply(newReply);
       }
       setNewReply(initialState);

       
   }

   

   
    return (
        <>
            {width >= 640 ? (
                <div className='card w-full min-h-fit flex flex-row px-5 py-5 rounded-md'>
                <form 
                className="w-full flex flex-row items-start gap-5"
                onSubmit={handleNewComment}
                >
                  <img className="inline object-cover w-8 h-8 rounded-full" src={currentUser.image.webp} alt={currentUser.username}/>
                  <textarea 
                  className="newcomment__textarea w-full  resize-none py-2 px-4" 
                  placeholder="Add a comment..." 
                  rows={4}
                  onChange={handleInputChange}
                  name="content"
                  value={newReply.content}
                  ></textarea>
                  <button className="newcomment__button px-8 py-3 rounded-md cursor-pointer hover:opacity-50">REPLY</button>
                </form>
            </div>
            ) : (
                <div className='card w-full min-h-fit flex flex-col px-5 py-5 rounded-md'>
                    <form 
                    className="w-full flex flex-col items-start gap-5"
                    onSubmit={handleNewComment}
                    >
                    <textarea 
                    className="newcomment__textarea w-full  resize-none py-2 px-4" 
                    placeholder="Add a comment..." 
                    rows={4}
                    onChange={handleInputChange}
                    name="content"
                    value={newReply.content}
                    ></textarea>
                    <div className="flex flex-row w-full justify-between">
                        <img className="inline object-cover w-8 h-8 rounded-full" src={currentUser.image.webp} alt={currentUser.username}/>
                        <button className="newcomment__button px-8 py-3 rounded-md cursor-pointer hover:opacity-50">REPLY</button>
                    </div>
                    </form>
                </div>
            )}
        </>
    )
}
