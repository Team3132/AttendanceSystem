import api from "@/services/api";
import queryClient from "@/services/queryClient";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authKeys} from './keys'
export default function useLogout () {
    const navigate = useNavigate()

    return useMutation({
        mutationFn: () => api.auth.signout(),
        onSuccess: () => {
            location.reload()
        }
    })
}