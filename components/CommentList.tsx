interface IProps {
  name: string;
  toDos: string;
}

const CommentList = ({ name, toDos }: IProps) => {
  //{ props }: { props: IProps }
  return (
    <div>
      <div>
        <div className="user-name">{name}</div>
        <div className="comment">{toDos}</div>
      </div>

      <style jsx>{`
        .user-name {
          width: 300px;
          height: 30px;
          display: flex;
          justify-content: left;
          align-items: center;
          font-weight: 600;
          padding-left: 10px;
          margin: 0 auto;
          color: #6a6a6a;
        }
        .comment {
          width: 300px;

          background-color: #f5f5f5;
          border-radius: 2px;
          display: flex;
          justify-content: left;
          align-items: center;
          padding: 10px;
          color: #6a6a6a;
          box-shadow: 1px 2px 5px lightgrey;
          margin: 0 auto;
          margin-top: 5px;
          margin-bottom: 10px;
          overflow: hidden;
          word-wrap: break-word;
        }
      `}</style>
    </div>
  );
};

export default CommentList;
