<?php

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PATCH, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}

$dataDir = __DIR__ . "/data";
$dataFile = $dataDir . "/activities.json";

if (!is_dir($dataDir)) {
    mkdir($dataDir, 0777, true);
}

function sendJson($data, $status = 200)
{
    http_response_code($status);

    echo json_encode(
        $data,
        JSON_PRETTY_PRINT
    );

    exit;
}

function readActivities($file)
{
    if (!file_exists($file)) {
        return [];
    }

    $json = file_get_contents($file);

    $data = json_decode($json, true);

    if (!is_array($data)) {
        return [];
    }

    return $data;
}

function writeActivities($file, $activities)
{
    return file_put_contents(
        $file,
        json_encode(
            array_values($activities),
            JSON_PRETTY_PRINT
        ),
        LOCK_EX
    ) !== false;
}

$activities = readActivities($dataFile);

$method = $_SERVER["REQUEST_METHOD"];

$action = $_GET["action"] ?? "activities";


/* GET */

if ($method === "GET") {

    if ($action === "activities") {

        sendJson([
            "success" => true,
            "data" => $activities
        ]);

    }

    if ($action === "activity") {

        $id = (int)($_GET["id"] ?? 0);

        foreach ($activities as $activity) {

            if ((int)$activity["id"] === $id) {

                sendJson([
                    "success" => true,
                    "data" => $activity
                ]);

            }

        }

        sendJson([
            "success" => false,
            "message" => "Activity not found."
        ], 404);

    }

    sendJson([
        "success" => false,
        "message" => "Unknown action."
    ], 400);
}


/* READ POST/PATCH DATA */

$input = json_decode(
    file_get_contents("php://input"),
    true
);

if (!is_array($input)) {
    $input = [];
}


/* POST */

if ($method === "POST") {

    $nextId = 1;

    foreach ($activities as $activity) {

        $nextId = max(
            $nextId,
            ((int)$activity["id"]) + 1
        );

    }

    $newActivity = [

        "id" => $nextId,

        "name" => trim(
            $input["name"] ?? "New Activity"
        ),

        "type" => trim(
            $input["type"] ?? "Running"
        ),

        "date" => $input["date"] ??
            date("Y-m-d H:i"),

        "duration" => (int)(
            $input["duration"] ?? 0
        ),

        "caloriesBurned" => (int)(
            $input["caloriesBurned"] ?? 0
        ),

        "avgHeartRate" => (int)(
            $input["avgHeartRate"] ?? 0
        ),

        "status" => trim(
            $input["status"] ?? "completed"
        )

    ];

    $activities[] = $newActivity;

    if (!writeActivities(
        $dataFile,
        $activities
    )) {

        sendJson([
            "success" => false,
            "message" => "Unable to save data."
        ], 500);

    }

    sendJson([
        "success" => true,
        "message" => "Activity added successfully.",
        "data" => $newActivity
    ], 201);
}


/* PATCH */

if ($method === "PATCH") {

    $id = (int)(
        $input["id"] ??
        ($_GET["id"] ?? 0)
    );

    $found = false;

    foreach ($activities as &$activity) {

        if ((int)$activity["id"] !== $id) {
            continue;
        }

        $found = true;

        $fields = [
            "name",
            "type",
            "date",
            "duration",
            "caloriesBurned",
            "avgHeartRate",
            "status"
        ];

        foreach ($fields as $field) {

            if (array_key_exists(
                $field,
                $input
            )) {

                if (
                    $field === "name" ||
                    $field === "type" ||
                    $field === "date" ||
                    $field === "status"
                ) {

                    $activity[$field] =
                        trim(
                            (string)$input[$field]
                        );

                } else {

                    $activity[$field] =
                        (int)$input[$field];

                }

            }

        }

        break;
    }

    unset($activity);

    if (!$found) {

        sendJson([
            "success" => false,
            "message" => "Activity not found."
        ], 404);

    }

    if (!writeActivities(
        $dataFile,
        $activities
    )) {

        sendJson([
            "success" => false,
            "message" => "Unable to update data."
        ], 500);

    }

    foreach ($activities as $activity) {

        if ((int)$activity["id"] === $id) {

            sendJson([
                "success" => true,
                "message" => "Activity updated successfully.",
                "data" => $activity
            ]);

        }

    }

}


/* METHOD NOT ALLOWED */

sendJson([
    "success" => false,
    "message" => "Method not allowed."
], 405);

?>