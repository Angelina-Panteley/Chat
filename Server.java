import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.Headers;
import org.json.simple.parser.ParseException;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;


import java.lang.*;
import java.io.*;
import java.io.IOException;
import java.io.OutputStream;
import java.net.InetAddress;
import java.net.InetSocketAddress;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Server implements HttpHandler {
	
    private List<String> history = new ArrayList<String>();
    private MessageExchange messageExchange = new MessageExchange();

    public static void main(String[] args) {
    	try{
    		FileOutputStream fileStream = new FileOutputStream("id.txt");
    		ObjectOutputStream os = new ObjectOutputStream(fileStream);
    		os.writeObject(0);
    		os.close();
    	}
    	catch(Exception e){}
        if (args.length != 1)
            System.out.println("Usage: java Server port");
        else {
            try {
                System.out.println("Server is starting...");
                Integer port = Integer.parseInt(args[0]);
                HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);
                System.out.println("Server started.");
                String serverHost = InetAddress.getLocalHost().getHostAddress();
                System.out.println("Get list of messages: GET http://" + serverHost + ":" + port + "/chat?token={token}");
                System.out.println("Send message: POST http://" + serverHost + ":" + port + "/chat provide body json in format {\"message\" : \"{message}\"} ");

                server.createContext("/chat", new Server());
                server.setExecutor(null);
                server.start();
            } catch (IOException e) {
                System.out.println("Error creating http server: " + e);
            }
        }
    }

    @Override
    public void handle(HttpExchange httpExchange) throws IOException {
    	
    	/*try{
    	for(String s: history)
    	{
    		JSONParser parser = new JSONParser();
        	JSONObject jsonObj = (JSONObject) parser.parse(s); 
        	if(jsonObj.get("id").toString().equals("-1"))
        		history.remove(s);
    	}}
    	catch(Exception e){}*/
    	
        String response = "";

        if ("GET".equals(httpExchange.getRequestMethod())) {
            response = doGet(httpExchange);
        } else if ("POST".equals(httpExchange.getRequestMethod())) {
            doPost(httpExchange);
        }  else if ("PUT".equals(httpExchange.getRequestMethod())) {
                doPut(httpExchange);
        } else if ("DELETE".equals(httpExchange.getRequestMethod())) {
            doDelete(httpExchange);
            //System.out.println(response);
        } else {
            response = "Unsupported http method: " + httpExchange.getRequestMethod();
        }

        sendResponse(httpExchange, response);
    }

    private String doGet(HttpExchange httpExchange) {
        String query = httpExchange.getRequestURI().getQuery();
        if (query != null) {
            Map<String, String> map = queryToMap(query);
            String token = map.get("token");
            if (token != null && !"".equals(token)) {
                int index = messageExchange.getIndex(token);
                return messageExchange.getServerResponse(history.subList(index, history.size()));
            } else {
                return "Token query parameter is absent in url: " + query;
            }
        }
        return  "Absent query in url";
    }

    private void doPut(HttpExchange httpExchange)
    {
    	try {
            String message = messageExchange.getClientMessage(httpExchange.getRequestBody());
            System.out.println("Change message: " + message);
            JSONParser parser1 = new JSONParser();
        	JSONObject jsonObj1 = (JSONObject) parser1.parse(message); 
            for(String s: history)
            {
            	JSONParser parser = new JSONParser();
            	JSONObject jsonObj = (JSONObject) parser.parse(s); 
            	
            	if(jsonObj.get("id").toString().equals(jsonObj1.get("id").toString()) && !jsonObj.get("id").toString().equals("-1"))
            	{
            		JSONObject jsonObject = new JSONObject();
            		jsonObject.put("description", jsonObj1.get("description").toString());
                    jsonObject.put("id", jsonObj.get("id").toString());
                    jsonObject.put("user", jsonObj.get("user").toString());
                  //  System.out.println(s);
                    String news =  jsonObject.toJSONString();            
                    history.set(history.indexOf(s), news);

                   
                    System.out.println();
        			System.out.println("New history after edit:");
        			for(String s1: history)
                    {
                    	jsonObj = (JSONObject) parser.parse(s1); 
                    	System.out.println(s1);
                    }
                    System.out.println();
                    break;
            	}
        	}
            //history.add(message);
        } catch (ParseException e) {
            System.err.println("Invalid user message: " + httpExchange.getRequestBody() + " " + e.getMessage());
        }    	
    }
    
    private void doPost(HttpExchange httpExchange) {
        try {
            String message = messageExchange.getClientMessage(httpExchange.getRequestBody());
            System.out.println("Get Message from User : " + message);
            history.add(message);
        } catch (ParseException e) {
            System.err.println("Invalid user message: " + httpExchange.getRequestBody() + " " + e.getMessage());
        }
    }
   
   public String getIDFromJson(String s)
   {
	   int i;
	   for(i=0; i<s.length()-1; ++i)
	   {
		   String news = new String(s);
		   //System.out.println(news.substring(i,i+2) + " "+news.substring(i,i+2).equals("id") );
		   if(news.substring(i,i+2).equals("id")) //equals("id"));
		   {
			 // System.out.println("1");
			   break;
		   }
	   }
	   
	   //System.out.println("JSON"+s);
	   //System.out.println(s.substring(i, i+2));
	   i=0;
	   for(int j=i+2; j<s.length(); ++j)
	   {
		   String news = new String(s);
		   if(Character.isDigit(news.charAt(j)) && i==0)
		   {			
				   i=j;
			  // System.out.println(news.charAt(j));
		   }
		   if(!Character.isDigit(news.charAt(j)) && i!=0)
		   {
			   String sub = s.substring(i, j);
				// System.out.println(sub);
				 return sub;
		   }
	   }
				 
	   return null;
   }

   
   private void doDelete(HttpExchange httpExchange)
   {
    	try
    	{
    	String query = httpExchange.getRequestURI().getQuery();
        if (query != null)
        {
            Map<String, String> map = queryToMap(query);
            String token = map.get("id");
            if (token != null && !"".equals(token)) 
            {
            	for(int i=0; i < history.size(); ++i)
            	{
            		JSONParser parser = new JSONParser();
                	JSONObject jsonObj = (JSONObject) parser.parse(history.get(i));
                	
                	/*
                	System.out.println(token+ "!");
            		System.out.println(jsonObj.get("id").toString()+ "?");
            		*/
                	
            		if(jsonObj.get("id").toString().equals(token))
            		{
            			List<String> list = new ArrayList<String>();
            			list.add(new String(history.get(i)));
            			//change id
            			//history.remove(i);
            	        history.remove(i);
            			System.out.println();
            			System.out.println("New history:");
            			for(String s: history)
                        {
                        	jsonObj = (JSONObject) parser.parse(s); 
                        	System.out.println(s);
                        }
                        System.out.println();
            		}
                }
            	
            }
        }
    	}
            catch(Exception e){}
    }
    
  /*  private void doDelete(HttpExchange httpExchange) {
        String query = httpExchange.getRequestURI().getQuery();
        if (query != null) {
            Map<String, String> map = queryToMap(query);
            String idToken = map.get("id");
            if (idToken != null && !"".equals(idToken)) {
                Integer id = Integer.parseInt(idToken);
                history.remove(id);
                for(String s: history)
                	System.out.println(s);
            }
        }
    }*/
   /* private void doDelete(HttpExchange httpExchange) {
        try {
        	int id = messageExchange.getMessageID(httpExchange.getRequestBody());
            for(int i=0; i < history.size(); ++i)
            {
            	JSONParser parser = new JSONParser();
            	JSONObject jsonObj = (JSONObject) parser.parse(history.get(i)); 
            	
            	if(Integer.valueOf(jsonObj.get("id").toString()) == id)
            	{
            		history.remove(i);
            		break;
            	}
            }
            for(String s: history)
            {
            	System.out.println(s);
            }
        } catch (ParseException e) {
            System.err.println("Invalid message id: " + httpExchange.getRequestBody() + " " + e.getMessage());
        }
    }*/

    private void sendResponse(HttpExchange httpExchange, String response) throws IOException {
    	byte[] bytes = response.getBytes();
        Headers headers = httpExchange.getResponseHeaders(); // !!!
        headers.add("Access-Control-Allow-Origin","*");      // !!!

        if("OPTIONS".equals(httpExchange.getRequestMethod())) {
        headers.add("Access-Control-Allow-Methods","PUT, DELETE, POST, GET, OPTIONS");
        }
        httpExchange.sendResponseHeaders(200, response.length());
        OutputStream os = httpExchange.getResponseBody();
       // System.out.println(response);
        os.write(response.getBytes());
        os.flush();
        os.close();
    }

    private Map<String, String> queryToMap(String query) {
        Map<String, String> result = new HashMap<String, String>();
        for (String param : query.split("&")) {
            String pair[] = param.split("=");
            if (pair.length > 1) {
                result.put(pair[0], pair[1]);
            } else {
                result.put(pair[0], "");
            }
        }
        return result;
    }
}
