export default function Btn({btnClass, btnContent, onClick}){
    return(
        <button className={btnClass} onClick={onClick}>
            {btnContent}
        </button>
    )
}