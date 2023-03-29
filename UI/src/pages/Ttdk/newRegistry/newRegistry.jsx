import { Outlet } from "react-router-dom";
import styles from "./newRegistry.module.scss";
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);
function NewRegistry() {
    return (<div className={cx("container")}>
    <form action="" className={cx("form")}>
        <div className={cx("column one")}>
            <div className={cx("field username")}>
                <label for="Username_">Username</label>
                <input type="text" name="Username" id="Username_" placeholder="type your name in english only" required/>
            </div>
            <div className={cx("field password")}>
                <label for="Password_">password</label>
                <input type="password" name="password" id="Password_" placeholder="type a complex password" required/>
            </div>
            <div className={cx("field email")}>
                <label for="Email_">email</label>
                <input type="email" name="email" id="Email_"  placeholder="type a valid email" required/>
            </div>
        </div>
        <div className={cx("column two")}>
            <div className={cx("field phone")}>
                <label for="Phone_">phone</label>
                <input type="tel" name="phone" id="Phone_"/>
            </div>
            <div className={cx("field Brief")}>
                <label for="Brief_">brief</label>
                <textarea></textarea>
            </div>
        </div>
        <input type="submit" value="register" className={cx("register")}/>
    </form>
</div>
    );
}

export default NewRegistry;