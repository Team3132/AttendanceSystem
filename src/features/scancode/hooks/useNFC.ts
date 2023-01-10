import { useMutation } from "@tanstack/react-query";

export default function useNFC() {
    return useMutation({
        mutationFn: () => getNFC()
    })
}

const getNFC = async () => new Promise<string | null>(async (res, rej) => {
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
                res( record.id ?? null)
              }
        }
      } else {
        rej()
      }
    
})
  

