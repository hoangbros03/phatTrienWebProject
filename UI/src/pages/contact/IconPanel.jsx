
function IconPanel(props) {
    return (
        <div style={{
            display: 'inline-block',
            height: '50px'
        }}>
            <img style={{
                display: 'inline-block',
                verticalAlign: 'middle',
                width: '30px'
            }}
                src={props.src} />
            <p
                style={{
                    display: 'inline-block',
                    marginLeft: '20px'
                }}>{props.children}</p>
        </div>
    );
}

export default IconPanel;