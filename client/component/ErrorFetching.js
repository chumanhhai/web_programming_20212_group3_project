import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const ErrorFetching = () => {
    return (
        <div className="ErrorFetching">
            <div className="notFound">404</div>
            <div className="message">
                <FontAwesomeIcon icon="frown-open" size="3x" style={{ marginRight: "20px" }}/>
                <span style={{ fontSize: "32px" }}>Something went wrong</span>
            </div>
        </div>
    );
}

export default ErrorFetching;
