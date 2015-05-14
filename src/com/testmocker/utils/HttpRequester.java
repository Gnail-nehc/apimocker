package com.testmocker.utils;

import java.io.BufferedReader;  
import java.io.IOException;  
import java.io.InputStream;  
import java.io.InputStreamReader;  
import java.net.HttpURLConnection;  
import java.net.URL;  
import java.net.URLDecoder;
import java.nio.charset.Charset;  
import java.util.Map;  
import java.util.Map.Entry;
import java.util.Vector;  
   

public class HttpRequester {  
    private String defaultContentEncoding;  
   
    /** 
     * 默认的响应字符集 
     */   
    public String getDefaultContentEncoding() {  
        return this.defaultContentEncoding;  
    }  
   
    /** 
     * 设置默认的响应字符集 
     */  
    public void setDefaultContentEncoding(String defaultContentEncoding) {  
        this.defaultContentEncoding = defaultContentEncoding;  
    } 
    
    public HttpRequester() {  
        this.defaultContentEncoding = Charset.defaultCharset().name();  
    }  
   
    /** 
     * 发送GET请求 
     *  
     * @param urlString 
     *            URL地址 
     * @return 响应对象 
     * @throws IOException 
     */ 
    public HttpResponse sendGet(String urlString,String charSet) throws IOException {  
        return this.send(urlString, "GET", null, null, charSet);  
    }  
   
    /** 
     * 发送GET请求 
     *  
     * @param urlString 
     *            URL地址 
     * @param params 
     *            参数集合 
     * @return 响应对象 
     * @throws IOException 
     */ 
    public HttpResponse sendGet(String urlString, Map<String, String> params,String charSet)  
            throws IOException {  
        return this.send(urlString, "GET", params, null, charSet);  
    }  
   
    /** 
     * 发送GET请求 
     *  
     * @param urlString 
     *            URL地址 
     * @param params 
     *            参数集合 
     * @param propertys 
     *            请求属性 
     * @return 响应对象 
     * @throws IOException 
     */  
    public HttpResponse sendGet(String urlString, Map<String, String> params,  
            Map<String, String> propertys,String charSet) throws IOException {  
        return this.send(urlString, "GET", params, propertys,charSet);  
    }  
   
    /** 
     * 发送POST请求 
     *  
     * @param urlString 
     *            URL地址 
     * @return 响应对象 
     * @throws IOException 
     */  
    public HttpResponse sendPost(String urlString,String charSet) throws IOException {  
        return this.send(urlString, "POST", null, null,charSet);  
    }  
   
    /** 
     * 发送POST请求 
     *  
     * @param urlString 
     *            URL地址 
     * @param params 
     *            参数集合 
     * @return 响应对象 
     * @throws IOException 
     */ 
    public HttpResponse sendPost(String urlString, Map<String, String> params,String charSet)  
            throws IOException {  
        return this.send(urlString, "POST", params, null,charSet);  
    }  
   
    
    /** 
     * 发送POST请求 
     *  
     * @param urlString 
     *            URL地址 
     * @param params 
     *            参数集合 
     * @param propertys 
     *            请求属性 
     * @return 响应对象 
     * @throws IOException 
     */  
    public HttpResponse sendPost(String urlString, Map<String, String> params,  
            Map<String, String> propertys,String charSet) throws IOException {  
        return this.send(urlString, "POST", params, propertys,charSet);  
    }  
   
    /** 
     * 发送HTTP请求 
     *  
     * @param urlString 
     * @return 响应对象 
     * @throws IOException 
     */  
    private HttpResponse send(String urlString, String method,  
            Map<String, String> parameters, Map<String, String> propertys, String charSet)  
            throws IOException {
    	urlString=URLDecoder.decode(urlString, charSet);

        HttpURLConnection urlConnection = null;  
        
        if (method.equalsIgnoreCase("GET") && parameters != null) {  
            StringBuffer param = new StringBuffer();  
            int i = 0;  
            for (String key : parameters.keySet()) {  
                if (i == 0)  
                    param.append("?");  
                else  
                    param.append("&");  
                param.append(key).append("=").append(URLDecoder.decode(parameters.get(key), charSet));  
                i++;  
            }  
            urlString += param;  
        }  
        URL url = new URL(urlString);  
        urlConnection = (HttpURLConnection) url.openConnection();  
   
        urlConnection.setRequestMethod(method);  
        urlConnection.setDoOutput(true);  
        urlConnection.setDoInput(true);  
        urlConnection.setUseCaches(false);  
   
        if (propertys != null)  
            for (String key : propertys.keySet()) {  
                urlConnection.addRequestProperty(key, propertys.get(key));  
            }  
   
        if (method.equalsIgnoreCase("POST") && parameters != null) {  
            StringBuffer param = new StringBuffer();  
            for (String key : parameters.keySet()) {  
                param.append("&");  
                param.append(key).append("=").append(URLDecoder.decode(parameters.get(key), charSet));  
            }  
            urlConnection.getOutputStream().write(param.toString().getBytes(charSet));  
            urlConnection.getOutputStream().flush();  
            urlConnection.getOutputStream().close();  
        }  
   
        return this.makeContent(urlString, urlConnection);  
    }  
   
    /** 
     * 得到响应对象 
     *  
     * @param urlConnection 
     * @return 响应对象 
     * @throws IOException 
     */  
    private HttpResponse makeContent(String urlString,  
            HttpURLConnection urlConnection) throws IOException {  
        HttpResponse httpResponser = new HttpResponse();  
        try {  
            InputStream in = urlConnection.getInputStream();  
            BufferedReader bufferedReader = new BufferedReader(  
                    new InputStreamReader(in));  
            httpResponser.contentCollection = new Vector<String>();  
            StringBuffer temp = new StringBuffer();  
            String line = bufferedReader.readLine();  
            while (line != null) {  
                httpResponser.contentCollection.add(line);  
                temp.append(line).append("\r\n");  
                line = bufferedReader.readLine();  
            }  
            bufferedReader.close();  
   
            String ecod = urlConnection.getContentEncoding();  
            if (ecod == null)  
                ecod = this.defaultContentEncoding;  
   
            httpResponser.urlString = urlString;  
   
            httpResponser.defaultPort = urlConnection.getURL().getDefaultPort();  
            httpResponser.file = urlConnection.getURL().getFile();  
            httpResponser.host = urlConnection.getURL().getHost();  
            httpResponser.path = urlConnection.getURL().getPath();  
            httpResponser.port = urlConnection.getURL().getPort();  
            httpResponser.protocol = urlConnection.getURL().getProtocol();  
            httpResponser.query = urlConnection.getURL().getQuery();  
            httpResponser.ref = urlConnection.getURL().getRef();  
            httpResponser.userInfo = urlConnection.getURL().getUserInfo();  
   
            httpResponser.content = new String(temp.toString().getBytes(), ecod);  
            httpResponser.contentEncoding = ecod;  
            httpResponser.code = urlConnection.getResponseCode();  
            httpResponser.message = urlConnection.getResponseMessage();  
            httpResponser.contentType = urlConnection.getContentType();  
            httpResponser.method = urlConnection.getRequestMethod();  
            httpResponser.connectTimeout = urlConnection.getConnectTimeout();  
            httpResponser.readTimeout = urlConnection.getReadTimeout();  
   
            return httpResponser;  
        } catch (IOException e) {  
            throw e;  
        } finally {  
            if (urlConnection != null)  
                urlConnection.disconnect();  
        }  
    }
} 