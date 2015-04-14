import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.ParseException;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;
import org.json.simple.parser.ParseException;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

public class Client implements Runnable {

    private List<String> history = new ArrayList<String>();
    private MessageExchange messageExchange = new MessageExchange();
    private String host;
    private Integer port;
    
    private String name = "User "+String.valueOf(System.currentTimeMillis());

    public Client(String host, Integer port) {
        this.host = host;
        this.port = port;
    }


    public static void main(String[] args) {
        if (args.length != 2)
            System.out.println("Usage: java ChatClient host port");
        else {
            System.out.println("Connection to server...");
            String serverHost = args[0];
            Integer serverPort = Integer.parseInt(args[1]);
            Client client = new Client(serverHost, serverPort);
            new Thread(client).start();
            System.out.println("Connected to server: " + serverHost + ":" + serverPort);
            client.listen();
        }
    }

    private HttpURLConnection getHttpURLConnection() throws IOException {
    	URL url = new URL("http://" + host + ":" + port + "/chat?token=" + messageExchange.getToken(history.size()));
    	return (HttpURLConnection) url.openConnection();
    }

    public List<String> getMessages() {
        List<String> list = new ArrayList<String>();
        HttpURLConnection connection = null;
        try {
            connection = getHttpURLConnection();
            connection.connect();
            //System.out.println(messageExchange.inputStreamToString(connection.getInputStream()));
            String response = messageExchange.inputStreamToString(connection.getInputStream());
         //   System.out.println("!");
            JSONObject jsonObject = messageExchange.getJSONObject(response);
            JSONArray jsonArray = (JSONArray) jsonObject.get("messages");
            for (Object o : jsonArray) {
            	System.out.println(o);
                list.add(o.toString());
            }
        } catch (IOException e) {
            System.err.println("ERROR: " + e.getMessage());
        } catch (ParseException e) {
            System.err.println("ERROR: " + e.getMessage());
        } finally {
            if (connection != null) {
                connection.disconnect();
            }
        }

        return list;
    }

    public void sendMessage(String message) {
        HttpURLConnection connection = null;
        try {
            connection = getHttpURLConnection();
            connection.setDoOutput(true);

            connection.setRequestMethod("POST");

            DataOutputStream wr = new DataOutputStream(connection.getOutputStream());
            wr.writeBytes(messageExchange.getClientSendMessageRequest(message, name));
            wr.flush();
            wr.close();

            connection.getInputStream();

        } catch (IOException e) {
            System.err.println("ERROR: " + e.getMessage());
        } finally {
            if (connection != null) {
                connection.disconnect();
            }
        }
    }

    public void listen() {
    	try{
        while (true) {
            List<String> list = getMessages();
            boolean flag = false;
            for(String s: list)
            {
            	
            	JSONParser parser = new JSONParser();
            	JSONObject jsonObj = (JSONObject) parser.parse(s); 
            	if(jsonObj.get("id").toString().equals("-1"))
            	{
            		history.remove(s);
            		flag = true;
            		break;
            	}
            }
            	if(!flag)
            		history.addAll(list);
                Thread.sleep(1000);
            }}
    		catch (InterruptedException e) {
                System.err.println("ERROR: " + e.getMessage());
            }
            catch(Exception e){}
        }

    @Override
    public void run() {
        Scanner scanner = new Scanner(System.in);

        while (true) {
            String message = scanner.nextLine();
            sendMessage(message);
        }
    }



}
