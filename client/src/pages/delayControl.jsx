import { NavLink } from "react-router-dom";

//Components
import FormManagement from "../components/containers/formManagement.jsx";
import LoggedHeader from "../components/layout/loggedHeader.jsx"
import MainContent from '../components/layout/mainContent.jsx'
import Footer from "../components/layout/footer.jsx"

//icons
import { AlarmClock } from "lucide-react";

function DelayControl() {

    return(
        <>
            <LoggedHeader />

            <MainContent>
                <FormManagement 
                    icon={AlarmClock}
                    title="Gerenciamento de Atrasos"
                    bgColor="bg-red-500"
                >
                </FormManagement>
            </MainContent>


            <Footer />
        </>
    )
}

export default DelayControl;