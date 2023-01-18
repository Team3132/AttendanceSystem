import { useTab, useToast } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";

export default function useNFC() {
  const toast = useToast()

    return useMutation({
        mutationFn: () => getNFC(),
        onSuccess(data, variables, context) {
          toast({description: JSON.stringify(data)})
        },
    })
}

const getNFC = async () => new Promise<string | undefined>(async (res, rej) => {
    if ("NDEFReader" in window) {
        const ndef = new NDEFReader();
        await ndef.scan();
        ndef.onreadingerror = () => {
          throw new Error("Reading failed");
        };
        ndef.onreading = event => {
            const {message} = event;
            for (const record of message.records) {
                console.log("Record type:  " + record.recordType);
                console.log("MIME type:    " + record.mediaType);
                console.log("Record id:    " + record.id);
                
                res( record.id)
              }
        }
      } else {
        rej()
      }
    
})
  

