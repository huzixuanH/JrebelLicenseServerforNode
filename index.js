const express = require("express");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");

const JrebelSign = require("./JrebelSign");

const app = express();
const SERVER_GUID = "a1b4aea8-b031-4302-b602-670a990272cb";

app.use(bodyParser.urlencoded({ extended: true })); // 解析 application/x-www-form-urlencoded
app.use(bodyParser.json()); // 解析 application/json

class MainServer {
  constructor() {
    this.SERVER_GUID = SERVER_GUID;
  }

  static parseArguments(args) {
    if (args.length % 2 !== 0) {
      throw new Error("Error in argument's length ");
    }

    const params = {};

    for (let i = 0; i < args.length; ) {
      let argName = args[i++];

      if (argName.charAt(0) === "-") {
        if (argName.length < 2) {
          throw new Error("Error at argument " + argName);
        }
        argName = argName.substring(1);
      }

      params[argName] = args[i++];
    }
    return params;
  }

  static main() {
    const args = process.argv.slice(2);
    const arguments1 = MainServer.parseArguments(args);
    let port = arguments1.p || "9009";

    if (!/^\d+$/.test(port)) {
      port = "9009";
    }

    const serverPort = parseInt(port);

    app.listen(serverPort, () => {
      console.log(`License Server started at http://localhost:${serverPort}`);
      console.log(
        `JRebel 7.1 and earlier version Activation address was: http://localhost:${serverPort}/{tokenname}, with any email.`
      );
      console.log(
        `JRebel 2018.1 and later version Activation address was: http://localhost:${serverPort}/{guid}(eg:http://localhost:${serverPort}/${MainServer.getUUID()}), with any email.`
      );
    });

    const mainServerInstance = new MainServer();

    app.all("/*any", (req, res) => {
      const baseRequest = {
        getRequestURI: () => req.originalUrl.split("?")[0],
        getContentType: () => req.headers["content-type"] || "",
        getMethod: () => req.method,
        getProtocol: () => req.protocol.toUpperCase(),
        getPathInfo: () => req.path,
        getQueryString: () => req.originalUrl.split("?")[1] || "",
        getRemoteAddr: () => req.ip || req.connection.remoteAddress,
        getRemoteHost: () => req.hostname,
        getRemotePort: () => req.socket.remotePort,
        getRemoteUser: () => "",
        setHandled: (handled) => {
          /* Express 自动处理路由，无需手动设置 */
        },
      };

      console.log(
        `#${baseRequest.getRequestURI()}` +
          `#${baseRequest.getContentType()}` +
          `#${baseRequest.getMethod()}` +
          `#${baseRequest.getProtocol()}` +
          `#${baseRequest.getPathInfo()}` +
          `#${baseRequest.getQueryString()}` +
          `#${baseRequest.getRemoteAddr()}` +
          `#${baseRequest.getRemoteHost()}` +
          `#${baseRequest.getRemotePort()}` +
          `#${baseRequest.getRemoteUser()}`
      );

      mainServerInstance.handle(req.path, baseRequest, req, res);
    });
  }

  async handle(target, baseRequest, request, response) {
    response.status(403);
    // console.log(`Handling target: ${target}`);

    if (target === "/") {
      this.indexHandler(baseRequest, request, response);
    } else if (target === "/jrebel/leases" || target === "/agent/leases") {
      this.jrebelLeasesHandler(baseRequest, request, response);
    } else if (target === "/jrebel/leases/1" || target === "/agent/leases/1") {
      this.jrebelLeases1Handler(baseRequest, request, response);
    } else if (target === "/jrebel/validate-connection") {
      this.jrebelValidateHandler(baseRequest, request, response);
    } else if (target === "/rpc/ping.action") {
      this.pingHandler(baseRequest, request, response);
    } else if (target === "/rpc/obtainTicket.action") {
      this.obtainTicketHandler(baseRequest, request, response);
    } else if (target === "/rpc/releaseTicket.action") {
      this.releaseTicketHandler(baseRequest, request, response);
    } else {
      // 对于未匹配的路径，也可以在这里发送一个默认的 404 响应
      response.status(404).send("Not Found");
    }
  }

  sendJsonResponse(response, json) {
    response.setHeader("Content-Type", "application/json; charset=utf-8");
    response.status(200).send(json);
  }

  sendXmlResponse(response, xmlContent) {
    const body = `\n${xmlContent}`;
    response.setHeader("Content-Type", "text/html; charset=utf-8");
    response.status(200).send(body);
  }

  jrebelValidateHandler(baseRequest, request, response) {
    baseRequest.setHandled(true);
    const json = {
      serverVersion: "3.2.4",
      serverProtocolVersion: "1.1",
      serverGuid: this.SERVER_GUID,
      groupType: "managed",
      statusCode: "SUCCESS",
      company: "Administrator",
      canGetLease: true,
      licenseType: 1,
      evaluationLicense: false,
      seatPoolType: "standalone",
    };
    this.sendJsonResponse(response, json);
  }

  jrebelLeases1Handler(baseRequest, request, response) {
    baseRequest.setHandled(true);
    const json = {
      serverVersion: "3.2.4",
      serverProtocolVersion: "1.1",
      serverGuid: this.SERVER_GUID,
      groupType: "managed",
      statusCode: "SUCCESS",
      msg: null,
      statusMessage: null,
    };

    // 统一从 req.query 或 req.body 获取参数，因为 req.body 优先级更高 (用于 POST)
    const username = request.query.username || request.body.username;
    if (username && username.trim() !== "") {
      json.company = username;
    }

    this.sendJsonResponse(response, json);
  }

  jrebelLeasesHandler(baseRequest, request, response) {
    baseRequest.setHandled(true);
    const clientRandomness =
      request.query.randomness || request.body.randomness;
    const username = request.query.username || request.body.username;
    const guid = request.query.guid || request.body.guid;
    const reqOffline = request.query.offline || request.body.offline;
    let offline = Boolean(reqOffline === "true"); // 对应 Boolean.parseBoolean

    const oldGuid = request.query.oldGuid || request.body.oldGuid;
    if (oldGuid && oldGuid.trim() !== "") {
      offline = true;
    }

    let validFrom = "";
    let validUntil = "";

    const clientTime = request.query.clientTime || request.body.clientTime;
    try {
      const clientTimeMillis = parseInt(clientTime, 10);
      if (!isNaN(clientTimeMillis)) {
        validFrom = clientTime;
        validUntil = String(clientTimeMillis + 180 * 24 * 60 * 60 * 1000);
      }
    } catch (ignored) {
      // 忽略非法输入，保持默认空值
    }

    const json = {
      serverVersion: "3.2.4",
      serverProtocolVersion: "1.1",
      serverGuid: this.SERVER_GUID,
      groupType: "managed",
      id: 1,
      licenseType: 1,
      evaluationLicense: false,
      signature:
        "OJE9wGg2xncSb+VgnYT+9HGCFaLOk28tneMFhCbpVMKoC/Iq4LuaDKPirBjG4o394/UjCDGgTBpIrzcXNPdVxVr8PnQzpy7ZSToGO8wv/KIWZT9/ba7bDbA8/RZ4B37YkCeXhjaixpmoyz/CIZMnei4q7oWR7DYUOlOcEWDQhiY=",
      serverRandomness: "H2ulzLlh7E0=",
      seatPoolType: "standalone",
      statusCode: "SUCCESS",
      offline: offline,
      company: "Administrator",
      orderId: "",
      zeroIds: [],
      licenseValidFrom: validFrom,
      licenseValidUntil: validUntil,
    };

    if (offline) {
      json.validFrom = validFrom;
      json.validUntil = validUntil;
    }

    if (
      clientRandomness === undefined ||
      username === undefined ||
      guid === undefined
    ) {
      response.status(403).send("Forbidden");
    } else {
      const jrebelSign = new JrebelSign();
      jrebelSign.toLeaseCreateJson(
        clientRandomness,
        guid,
        offline,
        validFrom,
        validUntil
      );
      json.signature = jrebelSign.getSignature();
      json.company = username;
      this.sendJsonResponse(response, json);
    }
  }

  releaseTicketHandler(baseRequest, request, response) {
    baseRequest.setHandled(true);
    const salt = request.query.salt || request.body.salt;
    if (salt === undefined) {
      response.status(403).send("Forbidden");
      return;
    }
    const xmlContent = `<ReleaseTicketResponse><message></message><responseCode>OK</responseCode><salt>${this.escapeXml(
      salt
    )}</salt></ReleaseTicketResponse>`;
    this.sendXmlResponse(response, xmlContent);
  }

  obtainTicketHandler(baseRequest, request, response) {
    baseRequest.setHandled(true);
    const salt = request.query.salt || request.body.salt;
    const username = request.query.userName || request.body.userName;
    if (salt === undefined || username === undefined) {
      response.status(403).send("Forbidden");
      return;
    }
    const prolongationPeriod = "607875500";
    const xmlContent = `<ObtainTicketResponse><message></message><prolongationPeriod>${prolongationPeriod}</prolongationPeriod><responseCode>OK</responseCode><salt>${this.escapeXml(
      salt
    )}</salt><ticketId>1</ticketId><ticketProperties>licensee=${this.escapeXml(
      username
    )}\tlicenseType=0\t</ticketProperties></ObtainTicketResponse>`;
    this.sendXmlResponse(response, xmlContent);
  }

  pingHandler(baseRequest, request, response) {
    baseRequest.setHandled(true);
    const salt = request.query.salt || request.body.salt;
    if (salt === undefined) {
      response.status(403).send("Forbidden");
      return;
    }
    const xmlContent = `<PingResponse><message></message><responseCode>OK</responseCode><salt>${this.escapeXml(
      salt
    )}</salt></PingResponse>`;
    this.sendXmlResponse(response, xmlContent);
  }

  indexHandler(baseRequest, request, response) {
    baseRequest.setHandled(true);
    response.setHeader("Content-Type", "text/html; charset=utf-8");
    response.status(200);

    const licenseUrl = `${request.protocol}://${request.hostname}:${request.socket.localPort}`; // 对应 Java 的 request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort()

    let html = "<h3>使用说明（Instructions for use）</h3>";
    html += "<hr/>";
    html += "<h1>Hello,This is a Jrebel License Server!</h1>";
    html += `<p>JRebel 7.1 and earlier version Activation address was: <span style='color:red'>${licenseUrl}/{tokenname}</span>, with any email.`;
    html += `<p>JRebel 2018.1 and later version Activation address was: ${licenseUrl}/{guid}(eg:<span style='color:red'>${licenseUrl}/${MainServer.getUUID()}</span>), with any email.`;

    html += "<hr/>";

    html += "<h1>Hello，此地址是 Jrebel License Server!</h1>";
    html += `<p>JRebel 7.1 及旧版本激活地址: <span style='color:red'>${licenseUrl}/{tokenname}</span>, 以及任意邮箱地址。`;
    html += `<p>JRebel 2018.1+ 版本激活地址: ${licenseUrl}/{guid}(例如：<span style='color:red'>${licenseUrl}/${MainServer.getUUID()}</span>), 以及任意邮箱地址。`;

    response.send(html);
  }

  // XML 转义工具函数
  escapeXml(s) {
    if (s === null || s === undefined) return "";
    let out = "";
    for (let i = 0; i < s.length; i++) {
      const c = s.charAt(i);
      if (c === "&") {
        out += "&amp;";
      } else if (c === "<") {
        out += "&lt;";
      } else if (c === ">") {
        out += "&gt;";
      } else if (c === '"') {
        out += "&quot;";
      } else if (c === "'") {
        out += "&apos;";
      } else {
        out += c;
      }
    }
    return out;
  }

  static getUUID() {
    return uuidv4();
  }
}

MainServer.main();
