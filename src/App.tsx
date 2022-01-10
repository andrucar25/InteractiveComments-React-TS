
import Jsondata from './data.json';
import './App.css';
import { useState } from 'react';
import { IComment } from './interfaces/IComment';
import Card from './components/Card';
import NewComment from './components/NewComment';
import { ICurrentUser } from './interfaces/ICurrentUser';


function App() {

  const [comments, setComments] = useState<IComment[]>(Jsondata.comments);
  const [currentUser, setCurrentUser] = useState<ICurrentUser>(Jsondata.currentUser);

  
  //Agregar comentario
  const addNewComment = (comment:IComment) => {
    setComments([...comments, {...comment, id:Date.now(), createdAt:Date.now()}]);
    
  }
 
  //Actualizar puntaje de comentario o replica suma
  const plusComment = (id?:number) =>{

    const commentr = comments.find(comment => comment.id === id)
    if(commentr !== undefined){
      commentr.score ++;
     }
     setComments([...comments])
  }


  //Actualizar puntaje de comentario resta
  const minusComment = (id?:number) =>{

    const commentr = comments.find(comment => comment.id === id)
    if(commentr !== undefined){
      commentr.score --;
      setComments([...comments]);
     }
  }




  return (
   <>
    <main className='main min-h-screen flex justify-center'>
      <div className='flex flex-col w-11/12 sm:w-4/5 min-h-screen gap-7 py-10 max-w-7xl '>
        {/* Ordenar los comentarios de mayor a menor en la vista, segun su score */}
      {comments
          .sort((a, b) => {
            if (a.score > b.score) return -1;
            if (a.score < b.score) return 1;
            return 0;
          })
      .map(comment=> (
          <Card key={comment.id} comment={comment} currentUser={currentUser} 
          plusComment={plusComment} minusComment={minusComment}
          comments={comments}
          setComments={setComments} 
          />
        ))}
        <NewComment currentuser={currentUser} addNewComment={addNewComment} />
      </div>

    </main>
   </>
  );
}

export default App;
