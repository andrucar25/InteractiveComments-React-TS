import { IReply } from "../interfaces/IReply";
import iconplus from "../images/icon-plus.svg";
import iconminus from "../images/icon-minus.svg";
import iconreply from "../images/icon-reply.svg";
import icondelete from "../images/icon-delete.svg";
import iconedit from "../images/icon-edit.svg";
import { ICurrentUser } from "../interfaces/ICurrentUser";
import { ChangeEvent, useLayoutEffect, useState } from "react";
import ReplyForm from "./ReplyForm";
import { IComment } from "../interfaces/IComment";
import DeleteModel from "./DeleteModel";


interface Props{
    reply:IReply;
    currentUser:ICurrentUser;
    PlusScoreReply:(idreply?:number)=>void;
    MinusScoreReply:(idreply?:number)=>void;
    comment:IComment;
    comments:IComment[],
    setComments:React.Dispatch<React.SetStateAction<any>>;
    timeSince:(date:number)=>string;

    
}

type HandleInputChange = ChangeEvent<HTMLTextAreaElement>

export default function Reply({reply, currentUser, PlusScoreReply, MinusScoreReply,comment, comments, setComments, timeSince}:Props) {

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
    
    //Sumar al score del reply
    const handlePlusScoreReply = (e: React.MouseEvent<HTMLButtonElement>)=>{
        e.preventDefault();
        PlusScoreReply(reply.id);
    }

    //Restar al score del reply
    const handleMinusScoreReply = (e: React.MouseEvent<HTMLButtonElement>)=>{
        e.preventDefault();
        MinusScoreReply(reply.id);
    }

     //Mostrar u ocultar form de reply a comentario
     const showReplyFormUnderComment = (e: React.MouseEvent<HTMLButtonElement>)=>{
        e.preventDefault();
        setShowReplyForm(!showReplyForm);
    }

    //Agregar un nuevo reply al comment principal, pero respondiendo a otro reply
    const addNewReply = (reply:IReply) => {
        setShowReplyForm(false);
        comment.replies = [...comment.replies, {...reply, id:Date.now(), createdAt:Date.now()}]
        setComments([...comments]);
        
    }


    //Abrir modal de delete
    const openDeleteModal = (e:any)=>{
        e.preventDefault();
    setshowDeleteModal(!showDeleteModal);
    }

     //Borrar reply de comentario
    const deleteReply = (idReply:number)=>{
        setshowDeleteModal(false);
        comment.replies =  comment.replies.filter( reply => reply.id !== idReply)
        setComments([...comments]);           
  }

     //Cambiar el estado de la card a editar
     const openEditComment =(e:any)=>{
        e.preventDefault();
        setIsEditing(!isEditing);
    }

    //Editar comment 
    const edit=(e: React.MouseEvent<HTMLButtonElement>)=>{
        e.preventDefault();
        editComment();
        // if(comment.id !== undefined){
        //     editComment();
        // }
    }

    const handleInputChange = ({
        target: {value, name}
    }: HandleInputChange ) => {
        setInitialContent({...initialContent,[name]: value});
    }

    const editComment = ()=>{
        reply.content = initialContent.content;
        // comment.content = initialContent.content;
        setIsEditing(!isEditing);
        console.log(reply);
        
    }

    
    return (
        <>
         {showDeleteModal && 
            <DeleteModel
            setshowDeleteModal={setshowDeleteModal}
            comment={comment}
            reply={reply}
            deleteReply={deleteReply}

            />
        }
        <article className="card w-full min-h-fit flex flex-row gap-5 px-5 py-5 rounded-md">
            {width > 768 && (
                <div className="flex flex-col h-full ">
                    <button 
                    className="btn_plus_minus h-9 w-9 flex flex-row justify-center items-center cursor-pointer rounded-t-md"
                    onClick={handlePlusScoreReply}
                    >
                        <img src={iconplus}/>
                    </button>
                    <p className="card__score h-9 w-9 flex flex-row justify-center items-center">
                        {reply.score}
                    </p>
                    <button 
                    className="btn_plus_minus h-9 w-9 flex flex-row justify-center items-center cursor-pointer rounded-b-md"
                    onClick={handleMinusScoreReply}
                    >
                        <img src={iconminus}/>
                    </button>
                </div>
            )}
            <div className="h-full w-full flex flex-col gap-5">
                <div className="flex flex-row justify-between w-full ">
                   
                    <div className="flex flex-row gap-3 items-center ">
                         <img className="inline object-cover w-8 h-8 rounded-full " src={reply.user.image.webp} alt={reply.user.username}/>
                         <p className="card__username ">{reply.user.username}</p>
                         {reply.user.username === currentUser.username && (
                             <span className="newcomment__button px-2 ">you</span>
                         )}
                         {typeof reply.createdAt === "number" ? (
                             <p className="card_createdAt">{timeSince(reply.createdAt)} ago</p>
                         ): (
                            <p className="card_createdAt">{reply.createdAt}</p> 
                         ) }
                    </div>
                    
                   {width > 768 &&(
                        reply.user.username === currentUser.username ? (
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
                           <span className="card__replyto">@{reply.replyingTo}</span> {reply.content}
                        </p>
                    )}
                    {width <= 768 && (
                         reply.user.username === currentUser.username ? (
                            <div className="flex flex-row justify-between">
                                 <div className="flex flex-row h-full ">
                                    <button 
                                        className="btn_plus_minus h-9 w-9 flex flex-row justify-center items-center cursor-pointer rounded-t-md"
                                        onClick={handlePlusScoreReply}
                                        >
                                        <img src={iconplus}/>
                                        </button>
                                        <p className="card__score h-9 w-9 flex flex-row justify-center items-center">
                                                    {reply.score}
                                        </p>
                                        <button 
                                        className="btn_plus_minus h-9 w-9 flex flex-row justify-center items-center cursor-pointer rounded-b-md"
                                        onClick={handleMinusScoreReply}
                                        >
                                            <img src={iconminus}/>
                                    </button>
                                 </div>
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
                                        onClick={handlePlusScoreReply}
                                        >
                                        <img src={iconplus}/>
                                        </button>
                                        <p className="card__score h-9 w-9 flex flex-row justify-center items-center">
                                                    {reply.score}
                                        </p>
                                        <button 
                                        className="btn_plus_minus h-9 w-9 flex flex-row justify-center items-center cursor-pointer rounded-b-md"
                                        onClick={handleMinusScoreReply}
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
            usernameComment={reply.user.username}
            />
        )}

        </>
    )
}
