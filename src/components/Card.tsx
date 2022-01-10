import { IComment } from "../interfaces/IComment";
import iconplus from "../images/icon-plus.svg";
import iconminus from "../images/icon-minus.svg";
import iconreply from "../images/icon-reply.svg";
import icondelete from "../images/icon-delete.svg";
import iconedit from "../images/icon-edit.svg";
import Reply from "./Reply";
import { ICurrentUser } from "../interfaces/ICurrentUser";
import React, { ChangeEvent, useLayoutEffect, useState } from "react";
import ReplyForm from "./ReplyForm";
import { IReply } from "../interfaces/IReply";
import DeleteModel from "./DeleteModel";

interface Props{
    comment:IComment;
    currentUser:ICurrentUser;
    plusComment:(id?:number, idreply?:number)=>void;
    minusComment:(id?:number)=>void;
    comments:IComment[],
    setComments:React.Dispatch<React.SetStateAction<any>>;
    
}

type HandleInputChange = ChangeEvent<HTMLTextAreaElement>

export default function Card({comment, currentUser, plusComment, minusComment, comments, setComments}:Props) {

    const initialStateContent={
        content:comment.content
    };

    const [showReplyForm, setShowReplyForm] = useState(false);
    const [showDeleteModal, setshowDeleteModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [initialContent, setInitialContent] = useState(initialStateContent);
    
    const [width, setWidth] = useState<number>(0);

    //Responsive
    useLayoutEffect(() => {
        function updateWidth(){
            setWidth(window.innerWidth);
        }
        window.addEventListener('resize', updateWidth);
        updateWidth();
    }, )

    const handlePlusScore = (e: React.MouseEvent<HTMLButtonElement>)=>{
        e.preventDefault();
        plusComment(comment.id);

    }

    const handleMinusScore = (e: React.MouseEvent<HTMLButtonElement>)=>{
        e.preventDefault();
        minusComment(comment.id);
    }

    //Aumentar score de una reply de comentario
    const PlusScoreReply =(idreply?:number) =>{        
        const replyr = comment.replies.find(reply => reply.id === idreply)
        if(replyr !== undefined){
           replyr.score ++;
          }      
        setComments([...comments]);
    }

    //Restar score de una reply de comentario
    const MinusScoreReply =(idreply?:number) =>{        
        const replyr = comment.replies.find(reply => reply.id === idreply)
        if(replyr !== undefined){
           replyr.score --;
          }      
        setComments([...comments]);
    }

    //Mostrar u ocultar form de reply a comentario
    const showReplyFormUnderComment = (e: React.MouseEvent<HTMLButtonElement>)=>{
        e.preventDefault();
        setShowReplyForm(!showReplyForm);
    }


    //Guardar reply a comentario
    const addNewReply = (reply:IReply) => {
        setShowReplyForm(false);
        comment.replies = [...comment.replies, {...reply, id:Date.now(), createdAt:Date.now()}]
        
      }
      
    //Convertir la fecha number a letras 
  const timeSince = (date:number) => {
    
    let seconds = Math.floor((Date.now() - date) / 1000);

    let interval = seconds / 31536000;

    if (interval > 1) {
      return Math.floor(interval) + " years";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + " months";
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + " days";
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + " hours";
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + " minutes";
    }
    return Math.floor(seconds) + " seconds";
  };

  //Abrir modal de delete
  const openDeleteModal = (e:any)=>{
      e.preventDefault();
    setshowDeleteModal(!showDeleteModal);
  }

  
  //Borrar comentario
  const deleteComment = (idComment:number)=>{
    setshowDeleteModal(false);
    setComments(comments.filter(comment=> comment.id !== idComment));    
  }


    //Cambiar el estado de la card a editar
    const openEditComment =(e:any)=>{
        e.preventDefault();
        setIsEditing(!isEditing);
    }

    //Editar comment 
    const edit=(e: React.MouseEvent<HTMLButtonElement>)=>{
        e.preventDefault();
        if(comment.id !== undefined){
            editComment();
        }
    }

    //Agregar el content a un state para luego reemplazarlo y actualizar
    const handleInputChange = ({
        target: {value, name}
    }: HandleInputChange ) => {
        setInitialContent({...initialContent,[name]: value});
    }
    

    const editComment = ()=>{
        comment.content = initialContent.content;
        setIsEditing(!isEditing);
        
    }

   
  
    return (
        <>
        {showDeleteModal && 
            <DeleteModel
            setshowDeleteModal={setshowDeleteModal}
            deleteComment={deleteComment}
            comment={comment}

            />
        }
        <article className="card w-full min-h-fit flex flex-row gap-5 px-5 py-5 rounded-md">
           {width >768 &&(
                <div className="flex flex-col h-full ">
                    <button 
                    className="btn_plus_minus h-9 w-9 flex flex-row justify-center items-center cursor-pointer rounded-t-md"
                    onClick={handlePlusScore}
                    >
                        <img src={iconplus} />
                    </button>
                    <p className="card__score h-9 w-9 flex flex-row justify-center items-center">
                        {comment.score}
                    </p>
                    <button 
                    className="btn_plus_minus h-9 w-9 flex flex-row justify-center items-center cursor-pointer rounded-b-md"
                    onClick={handleMinusScore}
                    >
                        <img src={iconminus}/>
                    </button>
                </div>
           )}
            <div className="h-full w-full flex flex-col gap-5">
                <div className="flex flex-row justify-between w-full ">
                   
                    <div className="flex flex-row gap-3 items-center ">
                         <img className="inline object-cover w-8 h-8 rounded-full" src={comment.user.image.webp} alt={comment.user.username}/>
                         <p className="card__username ">{comment.user.username}</p>
                         {comment.user.username === currentUser.username && (
                             <span className="newcomment__button px-2 ">you</span>
                         )}
                         {typeof comment.createdAt === "number" ? (
                             <p className="card_createdAt">{timeSince(comment.createdAt)} ago</p>
                         ): (
                            <p className="card_createdAt">{comment.createdAt}</p> 
                         ) }
                         
                    </div>
                    {width > 768 &&(
                        comment.user.username === currentUser.username ? (
                            <div>
                            <button 
                            className="newcomment__delete inline-flex items-center cursor-pointer mr-6 hover:opacity-50"
                            onClick={openDeleteModal}
                            >
                                <img className="mr-2" src={icondelete}/>
                                Delete
                            </button>
                            <button 
                            className="card__reply inline-flex items-center cursor-pointer hover:opacity-50"
                            onClick={openEditComment}
                            >
                                <img className="mr-2" src={iconedit}/>
                                Edit
                            </button>
                            </div>
                         ):(
                            <button 
                            className="card__reply inline-flex items-center cursor-pointer hover:opacity-50"
                            onClick={showReplyFormUnderComment}
                            >
                                <img className="mr-2" src={iconreply}/>
                                Reply
                            </button>
                         ) 
                    )}
                  

                </div>
                <div className="w-full h-full flex flex-col gap-5">
                    {isEditing ? (
                        <>
                          <div className="flex flex-col items-end gap-5">
                            <textarea 
                                className="newcomment__textarea w-full  resize-none py-2 px-4" 
                                rows={4}
                                onChange={handleInputChange}
                                name="content"
                                value={initialContent.content}
                             ></textarea>
                            <button 
                            className="newcomment__button px-8 py-3 rounded-md cursor-pointer hover:opacity-50"
                            onClick={edit}
                            >UPDATE</button>
                          </div>
                        </>
                   
                    ):(
                        
                        <p className="card__content">
                         {comment.content}
                        </p>


                    )}
                    {width <= 768 && (
                        
                         comment.user.username === currentUser.username ? (
                            <div className="flex flex-row justify-between">
                                {/* SCORE */}
                                <div className="flex flex-row h-full ">
                                    <button 
                                    className="btn_plus_minus h-9 w-9 flex flex-row justify-center items-center cursor-pointer rounded-t-md"
                                    onClick={handlePlusScore}
                                    >
                                        <img src={iconplus} />
                                    </button>
                                    <p className="card__score h-9 w-9 flex flex-row justify-center items-center">
                                        {comment.score}
                                    </p>
                                    <button 
                                    className="btn_plus_minus h-9 w-9 flex flex-row justify-center items-center cursor-pointer rounded-b-md"
                                    onClick={handleMinusScore}
                                    >
                                        <img src={iconminus}/>
                                    </button>
                                </div>
                                 {/* SCORE */}
                            <div className="flex">
                                <button 
                                className="newcomment__delete inline-flex items-center cursor-pointer mr-6 hover:opacity-50"
                                onClick={openDeleteModal}
                                >
                                    <img className="mr-2" src={icondelete}/>
                                    Delete
                                </button>
                                <button 
                                className="card__reply inline-flex items-center cursor-pointer hover:opacity-50"
                                onClick={openEditComment}
                                >
                                    <img className="mr-2" src={iconedit}/>
                                    Edit
                                </button>
                            </div>

                            </div>
                         ):(
                            <div className=" flex flex-row justify-between">
                                 <div className="flex flex-row h-full ">
                                    <button 
                                    className="btn_plus_minus h-9 w-9 flex flex-row justify-center items-center cursor-pointer rounded-t-md"
                                    onClick={handlePlusScore}
                                    >
                                        <img src={iconplus} />
                                    </button>
                                    <p className="card__score h-9 w-9 flex flex-row justify-center items-center">
                                        {comment.score}
                                    </p>
                                    <button 
                                    className="btn_plus_minus h-9 w-9 flex flex-row justify-center items-center cursor-pointer rounded-b-md"
                                    onClick={handleMinusScore}
                                    >
                                        <img src={iconminus}/>
                                    </button>
                                </div>

                                <button 
                                    className="card__reply inline-flex items-center cursor-pointer hover:opacity-50"
                                    onClick={showReplyFormUnderComment}
                                    >
                                        <img className="mr-2" src={iconreply}/>
                                        Reply
                                </button>
                            </div>
                         ) 
                       
                    )}
                </div>
            </div>
        </article>
        {showReplyForm && (
            <ReplyForm
            currentUser={currentUser}
            addNewReply={addNewReply}
            usernameComment={comment.user.username}
            />
        )}

        {comment.replies.length > 0 &&(
            <div className="w-full sm:pl-9">
               <div className="reply__border flex flex-col gap-7 w-full pl-4 sm:pl-8 border-l-2 border-solid">
               
               {comment.replies
                .sort((a, b) => {
                    if (a.score > b.score) return -1;
                    if (a.score < b.score) return 1;
                    return 0;
                })
               .map(reply=> (
                        <Reply 
                        key={reply.id} 
                        reply={reply}
                        currentUser={currentUser}
                        PlusScoreReply={PlusScoreReply}
                        MinusScoreReply={MinusScoreReply}
                        comment={comment}
                        comments={comments}
                        setComments={setComments} 
                        timeSince={timeSince}
                        />
                    ))}

               </div>
            </div>
        )}
        </>
    )
}



// border-2 border-black border-solid