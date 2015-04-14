import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import java.io.*;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.List;

public class MessageExchange {

    private JSONParser jsonParser = new JSONParser();
    private static int ID = 1;

    public String getToken(int index) {
        Integer number = index * 8 + 11;
        return "TN" + number + "EN";
    }

    public int getIndex(String token) {
        return (Integer.valueOf(token.substring(2, token.length() - 2)) - 11) / 8;
    }

    public String getServerResponse(List<String> messages) {
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("messages", messages);
        jsonObject.put("token", getToken(messages.size()));
        return jsonObject.toJSONString();
    }

    public String getClientSendMessageRequest(String message, String name) {
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("description", message);
        jsonObject.put("id", String.valueOf(makeNewID()));
        jsonObject.put("user", name);
        return jsonObject.toJSONString();
    }

	
    public String getClientMessage(InputStream inputStream) throws ParseException {
    		return getJSONObject(inputStreamToString(inputStream)).toJSONString();
    }
    /*public String getClientMessage(InputStream inputStream) throws ParseException {
    	JSONParser parser = new JSONParser();
    	JSONObject jsonObj = (JSONObject) parser.parse(getJSONObject(inputStreamToString(inputStream)).toJSONString());    	
       
    	return jsonObj.get("message").toString();
    }*/

    public int getMessageID(InputStream inputStream) throws ParseException {
    	JSONParser parser = new JSONParser();
    	JSONObject jsonObj = (JSONObject) parser.parse(getJSONObject(inputStreamToString(inputStream)).toJSONString());    	
       
    	return Integer.valueOf(jsonObj.get("id").toString());
    }
    
    public static int returnOldID() throws FileNotFoundException, IOException, ClassNotFoundException
	{
		FileInputStream fileStream = new FileInputStream("id.txt");
		ObjectInputStream os = new ObjectInputStream(fileStream);
		int oldID = (Integer) os.readObject();
		os.close();
		return oldID;
	}
	
    //change
	public static int makeNewID()
	{
		try{
			int oldId = returnOldID();
			ID = oldId+1;
			serializeID();
		}
		catch(Exception e){}
		finally {return ID;}
	}
	
	public static void serializeID() throws FileNotFoundException, IOException
	{
		FileOutputStream fileStream = new FileOutputStream("id.txt");
		ObjectOutputStream os = new ObjectOutputStream(fileStream);
		os.writeObject(ID);
		os.close();
	}
    
    public JSONObject getJSONObject(String json) throws ParseException {
        return (JSONObject) jsonParser.parse(json);
    }

    public String inputStreamToString(InputStream in) {
        InputStreamReader is = new InputStreamReader(in);
        StringBuilder sb = new StringBuilder();
        BufferedReader br = new BufferedReader(is);
        String read = null;
        try {
            read = br.readLine();
        } catch (IOException e) {
            e.printStackTrace();
        }

        while (read != null) {
            sb.append(read);
            try {
                read = br.readLine();
            } catch (IOException e) {
                e.printStackTrace();
            }

        }

        return sb.toString();
    }
}
